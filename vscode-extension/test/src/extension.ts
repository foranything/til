// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  commands,
  Disposable,
  env,
  ExtensionContext,
  QuickPickItem,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from "vscode";

class WordCounter {
  private _statusBarItem: StatusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left
  );

  updateWordCount() {
    // Get the current text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      this._statusBarItem.hide();
      return;
    }

    let doc = editor.document;

    if (doc.languageId === "markdown") {
      let wordCount = this._getWordCount(doc);
      // Update the status bar
      this._statusBarItem.text =
        wordCount !== 1 ? `${wordCount} Words` : "1 Word";
      this._statusBarItem.show();
    } else {
      this._statusBarItem.hide();
    }
  }

  public _getWordCount(doc: TextDocument): number {
    let docContent = doc.getText();

    // Parse out unwanted whitespace so the split is accurate
    docContent = docContent.replace(/(< ([^>]+)<)/g, "").replace(/\s+/g, " ");
    docContent = docContent.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    let wordCount = 0;
    if (docContent !== "") {
      wordCount = docContent.split(" ").length;
    }

    return wordCount;
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}

class WordCounterController {
  private _wordCounter: WordCounter;
  private _disposable: Disposable;

  constructor(wordCounter: WordCounter) {
    this._wordCounter = wordCounter;

    // subscribe to selection change and editor activation events
    let subscriptions: Disposable[] = [];
    window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
    window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

    // update the counter for the current file
    this._wordCounter.updateWordCount();

    // create a combined disposable from both event subscriptions
    this._disposable = Disposable.from(...subscriptions);
  }

  dispose() {
    this._disposable.dispose();
  }

  private _onEvent() {
    console.log("_onEvent");
    this._wordCounter.updateWordCount();
  }
}

class Clipboard extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
}

class ClipboardProvider implements TreeDataProvider<Clipboard> {
  clipboardList: Clipboard[] = [];

  constructor() {}

  getTreeItem(element: Clipboard): TreeItem {
    return element;
  }
  getChildren(element?: Clipboard): Thenable<Clipboard[]> {
    const temp = [...this.clipboardList];
    return Promise.resolve(temp.reverse());
  }

  createTreeView() {
    window.createTreeView("clipboard.history", {
      treeDataProvider: new ClipboardProvider(),
    });
  }

  async addClipboardItem() {
    let copied = await env.clipboard.readText();
    copied = copied.replace(/\n/gi, "");
    const item = new Clipboard(copied, TreeItemCollapsibleState.None);
    if (this.clipboardList.find((c) => c.label === copied)) {
      this.clipboardList = this.clipboardList.filter((c) => c.label !== copied);
    }
    this.clipboardList.push(item);
  }

  register() {
    const disposables = [];
    const disposable1 = commands.registerCommand("clipboard.copy", async () => {
      await commands.executeCommand("editor.action.clipboardCopyAction");
      await this.addClipboardItem();
      window.setStatusBarMessage("copy!");
      this.createTreeView();
    });
    disposables.push(disposable1);
    const disposable2 = commands.registerCommand("clipboard.cut", async () => {
      await commands.executeCommand("editor.action.clipboardCutAction");
      await this.addClipboardItem();
      window.setStatusBarMessage("cut!");
      this.createTreeView();
    });
    disposables.push(disposable2);
    const disposable3 = commands.registerCommand(
      "clipboard.pasteFromClipboard",
      async () => {
        window.setStatusBarMessage("pasteFromClipboard!");
        this.createTreeView();
        const items = this.clipboardList
          .map((c) => ({
            label: c.label,
            description: "",
          }))
          .reverse();
        const item = await window.showQuickPick(items);
        const label = ((item as QuickPickItem).label as string).replace(
          / /gi,
          "\n"
        );
        await env.clipboard.writeText(label);
        window.setStatusBarMessage("copied in history!");
        if (!!window.activeTextEditor) {
          const editor = window.activeTextEditor;
          await editor.edit((textInserter) =>
            textInserter.delete(editor.selection)
          );
          editor.edit((textInserter) =>
            textInserter.insert(editor.selection.start, label)
          );
        }
      }
    );
    disposables.push(disposable3);
    const disposable4 = commands.registerCommand(
      "clipboard.history.copy",
      async (item: TreeItem) => {
        if (!item) return;
        const label = (item.label as string).replace(/ /gi, "\n");
        await env.clipboard.writeText(label);
        window.setStatusBarMessage("copied in history!");
      }
    );
    disposables.push(disposable4);
    const disposables5 = commands.registerCommand(
      "clipboard.history.remove",
      (item: TreeItem) => {
        this.clipboardList = this.clipboardList.filter(
          (c) => c.label !== item.label
        );
        this.createTreeView();
        window.setStatusBarMessage("removed in history!");
      }
    );
    disposables.push(disposables5);
    return disposables;
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const worldCounter = new WordCounter();
  const controller = new WordCounterController(worldCounter);

  context.subscriptions.push(worldCounter);
  context.subscriptions.push(controller);

  const clipboardProvider = new ClipboardProvider();
  const disposables = clipboardProvider.register();
  disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

// this method is called when your extension is deactivated
export function deactivate() {}
