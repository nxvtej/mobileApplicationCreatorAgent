import { file } from "bun";
import { onFileUpdate, onShellCommand } from "./os";

/*
    <boltArtifact>
        <boltAction type="shell">
            npm run start
        </boltAction>
        <boltAction type="file" filePath="src/index.js">
            console.log("Hello, world!");
        </boltAction>
    </boltArtifact>
*/
export class ArtifactProcessor {
  public currentArtifact: string;
  private onFileUpdate: (filePath: string, fileContent: string) => void;
  private onShellCommand: (shellCommand: string) => void;

  constructor(
    currentArtifact: string,
    onFileUpdates: (filePath: string, fileContent: string) => void,
    onShellCommands: (shellCommand: string) => void
  ) {
    this.currentArtifact = currentArtifact;
    this.onFileUpdate = onFileUpdate;
    this.onShellCommand = onShellCommand;
  }

  append(artifact: string) {
    this.currentArtifact += artifact;
  }

  parse() {
    const latestActionStart = this.currentArtifact
      .split("\n")
      .findIndex((line) => line.includes("<boltAction type="));
    const latestActionEnd =
      this.currentArtifact
        .split("\n")
        .findIndex((line) => line.includes("</boltAction>")) ??
      this.currentArtifact.split("\n").length - 1;

    if (latestActionStart === -1) {
      return;
    }

    const latestActionType = this.currentArtifact
      .split("\n")
      [latestActionStart].split('type="')[1]
      .split(" ")[0]
      .split(">")[0];

    const latestActionContent = this.currentArtifact
      .split("\n")
      .slice(latestActionStart, latestActionEnd + 1)
      .join("\n");

    try {
      if (latestActionType === '"shell"') {
        let shellCommand = latestActionContent.split("\n").slice(1).join("\n");
        if (shellCommand.includes("</boltAction>")) {
          shellCommand = shellCommand.split("</boltAction>")[0];
          this.currentArtifact =
            this.currentArtifact.split(latestActionContent)[1];
          console.log("shellCommand", shellCommand);
          this.onShellCommand(shellCommand);
        }
      } else if (latestActionType === '"file"') {
        let filePath = this.currentArtifact
          .split("\n")
          [latestActionStart].split("filePath=")[1]
          .split(">")[0];
        let fileContent = latestActionContent.split("\n").slice(1).join("\n");

        if (fileContent.includes("</boltAction>")) {
          fileContent = fileContent.split("</boltAction>")[0];

          this.currentArtifact =
            this.currentArtifact.split(latestActionContent)[1];
          console.log("filePath", filePath);
          this.onFileUpdate(filePath.split('"')[1], fileContent);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// krte krte dimag kharab kr diya
