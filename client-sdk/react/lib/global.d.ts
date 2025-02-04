declare module "*.module.css" {
  const classes: { [key: string]: string };
  export = classes;
}
declare module "*.svg" {
  const content: string;
  export default content;
}
