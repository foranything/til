// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, window}  from 'vscode';

class WordCounter {

	private _statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);

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
					this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
					this._statusBarItem.show();
			} else {
					this._statusBarItem.hide();
			}
	}

	public _getWordCount(doc: TextDocument): number {

			let docContent = doc.getText();

			// Parse out unwanted whitespace so the split is accurate
			docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
			docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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
			console.log('_onEvent');
			this._wordCounter.updateWordCount();
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	const worldCounter = new WordCounter();
	const controller = new WordCounterController(worldCounter);

	context.subscriptions.push(worldCounter);
	context.subscriptions.push(controller);
}

// this method is called when your extension is deactivated
export function deactivate() {}
