import { onFileUpdate, onShellCommand } from "./os";

export class ArtifactProcessor {
  public currentArtifact: string = "";
  private onFileUpdate: (filePath: string, fileContent: string) => void;
  private onShellCommand: (shellCommand: string) => void;

  constructor(
    currentArtifact: string,
    onFileUpdates: (filePath: string, fileContent: string) => void,
    onShellCommands: (shellCommand: string) => void
  ) {
    this.currentArtifact = currentArtifact;
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

/*
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

/**
 *<boltArtifact id="expo-calculator-app" title="Calculator App in React Native">
  <boltAction type="shell">
    npm install react-native-paper
  </boltAction>
  <boltAction type="file" filePath="app/calculator.tsx">
    import React, { useState } from 'react';
    import { StyleSheet, View } from 'react-native';
    import { Button, Text } from 'react-native-paper';

    const Calculator = () => {
      const [input, setInput] = useState('');

      const handlePress = (value: string) => {
        if (value === '=') {
          setInput(eval(input).toString());
        } else if (value === 'C') {
          setInput('');
        } else {
          setInput(input + value);
        }
      };

      const renderButton = (value: string) => (
        <Button mode="contained" style={styles.button} onPress={() => handlePress(value)}>
          {value}
        </Button>
      );

      return (
        <View style={styles.container}>
          <Text style={styles.textInput}>{input}</Text>
          <View style={styles.row}>
            {['1', '2', '3', '+'].map(renderButton)}
          </View>
          <View style={styles.row}>
            {['4', '5', '6', '-'].map(renderButton)}
          </View>
          <View style={styles.row}>
            {['7', '8', '9', '*'].map(renderButton)}
          </View>
          <View style={styles.row}>
            {['0', 'C', '=', '/'].map(renderButton)}
          </View>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      },
      textInput: {
        fontSize: 36,
        marginBottom: 24,
        alignSelf: 'stretch',
        textAlign: 'right',
        paddingRight: 20,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
      },
      row: {
        flexDirection: 'row',
      },
      button: {
        margin: 5,
        flex: 1,
      }
    });

    export default Calculator;
  </boltAction>
  <boltAction type="file" filePath="app/_layout.tsx">
    import { Stack } from "expo-router";

    export default function Layout() {
      return <Stack />
    }
  </boltAction>
  <boltAction type="file" filePath="app/index.tsx">
    import Calculator from './calculator';

    export default function App() {
      return <Calculator />;
    }
  </boltAction>
  <boltAction type="shell">
    npm run dev
  </boltAction>
</boltArtifact>
//   ================== 
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

  count: number = 0;
  parse() {
    if (this.count++ < 70) console.log("currentArtifact", this.currentArtifact);
    const latestActionStart = this.currentArtifact
      .split("\n")
      .findIndex((line) => line.includes("<boltAction type="));
    const latestActionEnd =
      this.currentArtifact
        .split("\n")
        .findIndex((line) => line.includes("</boltAction>")) ??
      this.currentArtifact.split("\n").length - 1;

    if (latestActionStart === -1) {
      console.log(
        "latestActionStart and End",
        latestActionStart,
        " ",
        latestActionEnd
      );
      console.log("No action found");
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
*/
