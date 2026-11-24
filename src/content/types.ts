export type Todo = { todo: string };
export type Media =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; src: string; poster?: string; captions: string; transcript: string; caption?: string };
export type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lang: string; title?: string; code: string }
  | { kind: "media"; media: Media }
  | { kind: "todo"; note: string };
export type Section = { id: string; heading: string; blocks: Block[] };
export type PageContent = { title: string; summary: string; sections: Section[] };
