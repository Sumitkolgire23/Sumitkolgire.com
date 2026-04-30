"use client";

import * as runtime from "react/jsx-runtime";

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType<unknown>>;
}

function useMDXComponent(code: string) {
  const fn = new Function(code);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fn({ ...runtime, _components: undefined } as any).default as React.ComponentType<{
    components?: Record<string, React.ComponentType<unknown>>;
  }>;
}

export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
