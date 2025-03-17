import { ArtifactProcessor } from "./indextest";

// Simulate streaming XML content
const xmlContent = `<boltArtifact id="calculator-app" title="Calculator App in React Native">
    <boltAction type="shell">
      npm install react-native-paper
    </boltAction>
    <boltAction type="file" filePath="app/calculator.tsx">
      import React, { useState } from 'react';
      import { View, Text, Button, StyleSheet } from 'react-native';

      export default function Calculator() {
        const [result, setResult] = useState<string>('');
        const [current, setCurrent] = useState<string>('');

        const handlePress = (value: string) => {
          if (value === '=') {
            calculateResult();
          } else if (value === 'C') {
            setResult('');
            setCurrent('');
          } else {
            setCurrent(current + value);
          }
        };

        const calculateResult = () => {
          try {
            const evalResult = eval(current);
            setResult(String(evalResult));
            setCurrent('');
          } catch (error) {
            setResult('Error');
          }
        };

        const buttons = ['1', '2', '3', 'C', '4', '5', '6', '+', '7', '8', '9', '-', '/', '0', '*', '=', '.'];

        return (
          <View style={styles.container}>
            <Text style={styles.result}>{result}</Text>
            <Text style={styles.current}>{current}</Text>
            <View style={styles.buttonContainer}>
              {buttons.map((button) => (
                <Button key={button} title={button} onPress={() => handlePress(button)} />
              ))}
            </View>
          </View>
        );
      }

      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        result: {
          fontSize: 32,
          marginVertical: 10,
        },
        current: {
          fontSize: 24,
          marginVertical: 5,
        },
        buttonContainer: {
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }
      });
    </boltAction>
  </boltArtifact>`;
const artifactProcessor = new ArtifactProcessor(
  (filePath, fileContent) => {
    console.log(`File Update: ${filePath}`);
    console.log(fileContent);
  },
  (shellCommand) => {
    console.log(`Shell Command: ${shellCommand}`);
  }
);

// Append and parse the XML content
artifactProcessor.append(xmlContent);
artifactProcessor.parse();
