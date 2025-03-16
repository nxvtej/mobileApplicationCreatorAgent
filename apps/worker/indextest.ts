import { onFileUpdate, onShellCommand } from "./os";

export class ArtifactProcessor {
  public currentArtifact: string = "";
  private onFileUpdate: (filePath: string, fileContent: string) => void;
  private onShellCommand: (shellCommand: string) => void;

  constructor(
    onFileUpdates: (filePath: string, fileContent: string) => void,
    onShellCommands: (shellCommand: string) => void
  ) {
    this.onFileUpdate = onFileUpdates;
    this.onShellCommand = onShellCommands;
  }

  append(artifact: string) {
    this.currentArtifact += artifact;
  }

  parse() {
    // Wait until the entire XML structure is available
    if (!this.currentArtifact.includes("</boltArtifact>")) {
      console.log("Waiting for complete XML structure...");
      return;
    }

    // Extract all <boltAction> blocks
    const actionBlocks =
      this.currentArtifact.match(/<boltAction[\s\S]*?<\/boltAction>/g) || [];

    for (const block of actionBlocks) {
      const typeMatch = block.match(/type="([^"]+)"/);
      if (!typeMatch) continue;

      const type = typeMatch[1];
      const content = block.replace(/<[^>]+>/g, "").trim();

      if (type === "shell") {
        this.onShellCommand(content);
      } else if (type === "file") {
        const filePathMatch = block.match(/filePath="([^"]+)"/);
        if (filePathMatch) {
          const filePath = filePathMatch[1];
          this.onFileUpdate(filePath, content);
        }
      }
    }

    // Clear the processed artifact to avoid reprocessing
    this.currentArtifact = "";
  }
}
