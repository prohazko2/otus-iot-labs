declare module "*.hex" {
  const url: string;
  export default url;
}

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  interface SvgSprite {
    id: string;
    viewBox: string;
    content: string;
  }
  const sprite: SvgSprite;
  export default sprite;
}
