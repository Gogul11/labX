// import * as monaco from 'monaco-editor'

// // export const doAfterEditorMount = (
// //   editor: monaco.editor.IStandaloneCodeEditor,
// //   monacoInstance: typeof monaco
// // ) => {
// //   console.log(editor.getValue());

// //   editor.addCommand(
// //     monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyK,
// //     () => {
// //       console.log("hi da");
// //     }
// //   );

// //   editor.focus()
// // };

// export const openTerminal = (
//     ref : React.RefObject<monaco.editor.IStandaloneCodeEditor> | null,
//     monacoInstance: typeof monaco
// ) => {
//     ref?.current.addCommand(
//         monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyK,
//         () => {
//             console.log("Hi")
//         }
//     )
// }