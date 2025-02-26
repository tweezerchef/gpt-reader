interface Window {
  electron: {
    ipcRenderer: {
      on: (channel: string, callback: (arg: string) => void) => void;
      send: (channel: string, ...args: any[]) => void;
    };
  };
}
declare module "*.png" {
  const content: any;
  export default content;
}
