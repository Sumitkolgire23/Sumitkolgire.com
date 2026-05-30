"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  BookOpen,
  Tag,
  X,
  Filter,
  MousePointerClick,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── TYPES ───────────────────────────────────────────────────────────────────
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "article" | "perspective" | "project" | "doc" | "tag";
  url: string;
  description?: string;
  tags?: string[];
  date?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

// Color matching layout tokens
const TYPE_COLORS = {
  article: {
    border: "var(--seal)",
    bg: "rgba(196, 30, 58, 0.15)",
    text: "var(--seal)",
    hex: "#c41e3a",
    shadow: "rgba(196, 30, 58, 0.4)",
  },
  perspective: {
    border: "var(--sky)",
    bg: "rgba(74, 158, 255, 0.15)",
    text: "var(--sky)",
    hex: "#4a9eff",
    shadow: "rgba(74, 158, 255, 0.4)",
  },
  project: {
    border: "var(--moss)",
    bg: "rgba(61, 139, 58, 0.15)",
    text: "var(--moss)",
    hex: "#3d8b3a",
    shadow: "rgba(61, 139, 58, 0.4)",
  },
  doc: {
    border: "#e8924a",
    bg: "rgba(232, 146, 74, 0.15)",
    text: "#e8924a",
    hex: "#e8924a",
    shadow: "rgba(232, 146, 74, 0.4)",
  },
  tag: {
    border: "var(--gold)",
    bg: "rgba(200, 169, 110, 0.15)",
    text: "var(--gold)",
    hex: "#c8a96e",
    shadow: "rgba(200, 169, 110, 0.4)",
  },
};

export function KnowledgeGraph() {
  const [data, setData] = useState<{ nodes: GraphNode[]; links: GraphLink[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Interactivity states
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["article", "perspective", "project", "doc", "tag"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // SVG & Zoom references
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomGroupRef = useRef<SVGGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // 1. Fetch graph data
  useEffect(() => {
    async function loadGraphData() {
      try {
        const res = await fetch("/api/graph");
        if (!res.ok) throw new Error("Failed to load graph data");
        const json = await res.json();
        
        // Deep copy nodes and links to safely feed D3
        const nodes: GraphNode[] = json.nodes.map((n: any) => ({ ...n }));
        const links: GraphLink[] = json.links.map((l: any) => ({ ...l }));
        
        setData({ nodes, links });
      } catch (err: any) {
        console.error(err);
        setError("Could not compile the digital brain map.");
      } finally {
        setLoading(false);
      }
    }
    loadGraphData();
  }, []);

  // 2. Filter nodes & links based on active checkboxes
  const filteredData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };

    const nodes = data.nodes.filter((n) => activeFilters.has(n.type));
    const nodeIds = new Set(nodes.map((n) => n.id));
    
    const links = data.links.filter((l) => {
      const sourceId = typeof l.source === "string" ? l.source : (l.source as any).id;
      const targetId = typeof l.target === "string" ? l.target : (l.target as any).id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    return { nodes, links };
  }, [data, activeFilters]);

  // 3. Search autosuggest results
  useEffect(() => {
    if (!searchQuery.trim() || !data) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = data.nodes.filter(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
    );
    setSearchResults(matches.slice(0, 8));
  }, [searchQuery, data]);

  // 4. Center node animation
  const centerNode = (node: GraphNode) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const targetX = node.x ?? width / 2;
    const targetY = node.y ?? height / 2;

    const transform = d3.zoomIdentity
      .translate(width / 2 - targetX * 1.5, height / 2 - targetY * 1.5)
      .scale(1.5);

    svg
      .transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform as any, transform);

    setSelectedNode(node);
    // Pin node temporarily
    node.fx = node.x;
    node.fy = node.y;
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.1).restart();
    }
  };

  // 5. Main D3 force graph pipeline
  useEffect(() => {
    if (loading || error || !filteredData.nodes.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoomGroup = d3.select(zoomGroupRef.current);
    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    // Reset translation coordinate system
    zoomGroup.selectAll("*").remove();

    // Recreate groups to guarantee drawing order (links in back, nodes in front)
    const gridG = zoomGroup.append("g").attr("class", "grid-group");
    const linksG = zoomGroup.append("g").attr("class", "links-group");
    const nodesG = zoomGroup.append("g").attr("class", "nodes-group");

    // Static Infinite Coordinate Grid
    gridG
      .append("rect")
      .attr("x", -10000)
      .attr("y", -10000)
      .attr("width", 20000)
      .attr("height", 20000)
      .attr("fill", "url(#infinite-grid)")
      .style("pointer-events", "none");

    // Initialize D3 force simulation
    const simulation = d3
      .forceSimulation<GraphNode>(filteredData.nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(filteredData.links)
          .id((d) => d.id)
          .distance((d) => {
            const source = d.source as GraphNode;
            const target = d.target as GraphNode;
            return source.type === "tag" || target.type === "tag" ? 45 : 75;
          })
      )
      .force("charge", d3.forceManyBody().strength(-140))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide<GraphNode>().radius((d) => (d.type === "tag" ? 28 : 38)))
      .alphaDecay(0.022);

    simulationRef.current = simulation;

    // Zoom and Pan behaviors
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4.0])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial zoom offset (zoomed out a tiny bit)
    svg.call(
      zoom.transform as any,
      d3.zoomIdentity.translate(0, 0).scale(0.95)
    );

    // Append Links (edges)
    const link = linksG
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(filteredData.links)
      .enter()
      .append("line")
      .attr("stroke", "var(--border)")
      .attr("stroke-opacity", 0.35)
      .attr("stroke-width", 1)
      .attr("class", "transition-all duration-300");

    // Append Nodes (containers)
    const node = nodesG
      .selectAll<SVGGElement, GraphNode>("g")
      .data(filteredData.nodes)
      .enter()
      .append("g")
      .attr("class", "cursor-pointer")
      .on("click", (event, d) => {
        // Prevent click if dragging
        if (event.defaultPrevented) return;
        
        // Open drawer
        setSelectedNode(d);
        
        // Pin coordinates
        d.fx = d.x;
        d.fy = d.y;
        
        // Highlight and center
        centerNode(d);
      })
      .on("mouseenter", (event, d) => {
        setHoveredNodeId(d.id);
        
        // Dynamic styling tweaks directly on SVG elements for top performance
        // Fade other nodes, highlight connected paths
        const connectedNodes = new Set<string>([d.id]);
        
        link.each(function (l) {
          const sId = typeof l.source === "string" ? l.source : l.source.id;
          const tId = typeof l.target === "string" ? l.target : l.target.id;
          if (sId === d.id) {
            connectedNodes.add(tId);
            d3.select(this)
              .attr("stroke", TYPE_COLORS[d.type].hex)
              .attr("stroke-opacity", 0.8)
              .attr("stroke-width", 1.8);
          } else if (tId === d.id) {
            connectedNodes.add(sId);
            d3.select(this)
              .attr("stroke", TYPE_COLORS[d.type].hex)
              .attr("stroke-opacity", 0.8)
              .attr("stroke-width", 1.8);
          }
        });

        node.each(function (n) {
          if (!connectedNodes.has(n.id)) {
            d3.select(this).style("opacity", 0.22);
          }
        });

        // Hover scale for current node
        d3.select(event.currentTarget)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.type === "tag" ? 9 : 13);
      })
      .on("mouseleave", (event, d) => {
        setHoveredNodeId(null);

        // Reset all nodes and links
        link
          .attr("stroke", "var(--border)")
          .attr("stroke-opacity", 0.35)
          .attr("stroke-width", 1);

        node.style("opacity", 1);

        d3.select(event.currentTarget)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.type === "tag" ? 6 : 9);
      })
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Node Glowing Halos
    node
      .append("circle")
      .attr("class", "halo-ring animate-pulse")
      .attr("r", (d) => (d.type === "tag" ? 14 : 18))
      .attr("fill", "none")
      .attr("stroke", (d) => TYPE_COLORS[d.type].hex)
      .attr("stroke-opacity", 0.15)
      .attr("stroke-width", 2)
      .style("opacity", 0); // hidden by default, toggled via CSS/search

    // Node core circle
    node
      .append("circle")
      .attr("r", (d) => (d.type === "tag" ? 6 : 9))
      .attr("fill", (d) => TYPE_COLORS[d.type].bg)
      .attr("stroke", (d) => TYPE_COLORS[d.type].border)
      .attr("stroke-width", 1.5)
      .style("filter", (d) => `drop-shadow(0 0 6px ${TYPE_COLORS[d.type].shadow})`);

    // Node label text
    node
      .append("text")
      .attr("dy", ".33em")
      .attr("x", (d) => (d.type === "tag" ? 10 : 13))
      .attr("font-family", "var(--mono)")
      .attr("font-size", (d) => (d.type === "tag" ? "9px" : "10px"))
      .attr("fill", (d) => (d.type === "tag" ? "var(--text3)" : "var(--text2)"))
      .text((d) => d.label);

    // Simulation tick callback
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as any).x)
        .attr("y1", (d) => (d.source as any).y)
        .attr("x2", (d) => (d.target as any).x)
        .attr("y2", (d) => (d.target as any).y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag handlers
    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.1).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep node pinned at dragged spot
    }

    // Cleanup on filter/size change
    return () => {
      simulation.stop();
    };
  }, [filteredData, loading, error]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (simulationRef.current && svgRef.current) {
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        simulationRef.current.force("center", d3.forceCenter(width / 2, height / 2));
        simulationRef.current.alpha(0.15).restart();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update halo rings based on selection
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll(".halo-ring").style("opacity", (d: any) => {
      return selectedNode && d.id === selectedNode.id ? 1 : 0;
    });
  }, [selectedNode]);

  // Category filter toggle handler
  const toggleFilter = (type: string) => {
    setActiveFilters((prev) => {
      const copy = new Set(prev);
      if (copy.has(type)) {
        // Prevent empty filter
        if (copy.size > 1) copy.delete(type);
      } else {
        copy.add(type);
      }
      return copy;
    });
    setSelectedNode(null);
  };

  // Zoom control triggers
  const triggerZoom = (direction: "in" | "out" | "reset") => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);

    if (direction === "reset") {
      svg
        .transition()
        .duration(500)
        .call(zoomBehaviorRef.current.transform as any, d3.zoomIdentity.translate(0, 0).scale(0.95));
    } else {
      const scaleFactor = direction === "in" ? 1.35 : 1 / 1.35;
      svg
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy as any, scaleFactor);
    }
  };

  // Release pinned node status
  const unpinSelected = () => {
    if (selectedNode) {
      selectedNode.fx = null;
      selectedNode.fy = null;
      if (simulationRef.current) {
        simulationRef.current.alpha(0.15).restart();
      }
      setSelectedNode(null);
    }
  };

  // UI helpers
  const getReadableType = (type: string) => {
    if (type === "doc") return "Document";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Loading view
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-ink-mid">
        <div className="w-8 h-8 rounded-full border border-t-transparent border-seal animate-spin mb-4" />
        <span className="font-mono text-xs text-text3 tracking-widest uppercase">
          Synthesizing brain map...
        </span>
      </div>
    );
  }

  // Error view
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-4">
        <Info className="w-8 h-8 text-seal mb-3" />
        <p className="font-serif text-lg text-ink mb-2">{error}</p>
        <span className="font-mono text-xs text-text3">
          Check if Velite and API endpoints are compiling correctly.
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[78vh] bg-bg2/45 border border-border rounded flex overflow-hidden">
      {/* 1. INFINITE D3 CANVAS */}
      <div className="flex-1 relative h-full">
        <svg ref={svgRef} className="w-full h-full block bg-bg select-none">
          <defs>
            {/* Subtle graph coordinates grid */}
            <pattern
              id="infinite-grid"
              width="45"
              height="45"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.065)" />
              <path
                d="M 45 0 L 0 0 0 45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.015)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <g ref={zoomGroupRef} />
        </svg>

        {/* 2. FLOATING SEARCH SYSTEM */}
        <div className="absolute top-4 left-4 z-50 w-72 max-w-[calc(100vw-2rem)]">
          <div className="relative flex items-center bg-bg3/90 backdrop-blur border border-border rounded px-3 py-1.5 shadow-lg focus-within:border-seal transition-colors">
            <Search className="w-3.5 h-3.5 text-text3 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, tags, posts..."
              className="w-full bg-transparent border-none outline-none text-xs text-ink placeholder:text-text4 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-0.5 rounded-full hover:bg-bg4 text-text3 transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Dropdown Suggest */}
          {searchResults.length > 0 && (
            <div className="absolute top-[105%] left-0 right-0 bg-bg3/95 backdrop-blur-md border border-border rounded mt-1 shadow-2xl max-h-60 overflow-y-auto scrollbar-thin">
              {searchResults.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    centerNode(node);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-bg4/70 border-b border-border/40 last:border-b-0 flex items-center justify-between text-xs text-ink-mid transition-all"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-sans font-medium text-ink truncate max-w-[180px]">
                      {node.label}
                    </span>
                    <span className="font-mono text-[9px] text-text3 uppercase tracking-wider">
                      {getReadableType(node.type)}
                    </span>
                  </div>
                  <MousePointerClick className="w-3 h-3 text-text3 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. FLOATING CAMERA CONTROLS */}
        <div className="absolute bottom-4 left-4 z-50 flex flex-col gap-1.5">
          <div className="flex flex-col bg-bg3/90 backdrop-blur border border-border rounded shadow-lg">
            <button
              onClick={() => triggerZoom("in")}
              className="p-2 border-b border-border/55 text-text2 hover:text-seal transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => triggerZoom("out")}
              className="p-2 border-b border-border/55 text-text2 hover:text-seal transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => triggerZoom("reset")}
              className="p-2 text-text2 hover:text-seal transition-colors"
              title="Fit View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="p-2 bg-bg3/90 backdrop-blur border border-border rounded shadow-lg text-text2 hover:text-seal flex items-center justify-center gap-1.5 text-xs font-mono"
          >
            <Filter className="w-4 h-4" />
            <span className="sr-only">Toggle Filters</span>
          </button>
        </div>

        {/* 4. FLOATING FILTERS OVERLAY */}
        {isFilterPanelOpen && (
          <div className="absolute bottom-16 left-4 z-50 bg-bg3/95 backdrop-blur-md border border-border rounded p-3 shadow-2xl w-48 font-mono text-[11px] text-ink-mid">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/60">
              <span className="uppercase text-text3 tracking-wider font-bold">Node Layers</span>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="text-text4 hover:text-ink"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5">
              {Object.keys(TYPE_COLORS).map((type) => {
                const key = type as keyof typeof TYPE_COLORS;
                const active = activeFilters.has(type);
                return (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer py-0.5 select-none hover:text-ink"
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleFilter(type)}
                      className="accent-seal w-3.5 h-3.5 border-border rounded"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{
                        backgroundColor: TYPE_COLORS[key].bg,
                        border: `1.5px solid ${TYPE_COLORS[key].border}`,
                        boxShadow: `0 0 4px ${TYPE_COLORS[key].shadow}`,
                      }}
                    />
                    <span className={cn(active ? "text-ink" : "text-text4")}>
                      {getReadableType(type)}s
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. SIDEBAR DETAILS DRAWER */}
      <div
        className={cn(
          "w-80 border-l border-border h-full bg-bg3/95 backdrop-blur-md flex flex-col transition-transform duration-350 ease-out z-[490]",
          selectedNode ? "translate-x-0" : "translate-x-full absolute right-0 top-0 bottom-0"
        )}
        style={{
          boxShadow: selectedNode ? "-10px 0 25px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {selectedNode && (
          <>
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-bg2/40">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded font-mono text-[9px] border font-semibold tracking-wider uppercase"
                  style={{
                    color: TYPE_COLORS[selectedNode.type].text,
                    borderColor: TYPE_COLORS[selectedNode.type].border,
                    backgroundColor: TYPE_COLORS[selectedNode.type].bg,
                  }}
                >
                  {getReadableType(selectedNode.type)}
                </span>
                {selectedNode.date && (
                  <span className="font-mono text-[9px] text-text4">
                    {selectedNode.date}
                  </span>
                )}
              </div>
              <button
                onClick={unpinSelected}
                className="p-1 rounded-full hover:bg-bg4 text-text3 hover:text-ink transition-colors"
                title="Release Pin & Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scroll Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              <h3 className="font-serif text-lg font-bold leading-tight text-ink">
                {selectedNode.label}
              </h3>

              {selectedNode.description && (
                <p className="text-xs text-text2 font-sans leading-relaxed">
                  {selectedNode.description}
                </p>
              )}

              {/* Tags references */}
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] text-text3 uppercase tracking-wider">
                    Associated Nodes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          if (data) {
                            const tagNode = data.nodes.find((n) => n.id === `tag:${t}`);
                            if (tagNode) centerNode(tagNode);
                          }
                        }}
                        className="flex items-center gap-1 px-1.5 py-0.5 bg-bg4/50 border border-border hover:border-gold hover:text-gold rounded font-mono text-[9px] text-text3 transition-colors text-left"
                      >
                        <Tag className="w-2.5 h-2.5 shrink-0" />
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Call to Action Footer */}
            {selectedNode.type !== "tag" && (
              <div className="p-4 border-t border-border bg-bg2/40">
                <a
                  href={selectedNode.url}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-bg4 hover:bg-seal hover:text-white border border-border text-xs text-ink-mid transition-all font-mono"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Read Full Content
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
