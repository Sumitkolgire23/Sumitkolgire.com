import * as runtime from "react/jsx-runtime";

import { ExpandableSidenote } from "@/components/wabi/ExpandableSidenote";
import { SealStamp } from "@/components/wabi/SealStamp";
import { CodeBlock } from "@/components/wabi/CodeBlock";

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType<any>>;
}

function useMDXComponent(code: string) {
  const fn = new Function(code);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fn({ ...runtime, _components: undefined } as any).default as React.ComponentType<{
    components?: Record<string, React.ComponentType<any>>;
  }>;
}

const defaultComponents = {
  ExpandableSidenote,
  SealStamp,
  pre: CodeBlock,
};

export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code);
  const combinedComponents = { ...defaultComponents, ...components };
  return <Component components={combinedComponents as any} />;
}


