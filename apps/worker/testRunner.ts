import { ArtifactProcessor } from "./indextest";

// Simulate streaming XML content
const xmlContent =
  "Let's create a simple \"Hello World\" app using React Native and Expo Router. \n\n### Steps:\n\n1. We'll create a new screen in the `app` folder that displays \"Hello World\".\n2. Add this new screen to the navigation.\n\n### Structure:\n\n- We'll structure it using a route that maps to a screen displaying \"Hello World\".\n\nHere's how we can achieve this:\n\n<boltArtifact id=\"hello-world-app\" title=\"Hello World App in React Native\">\n  <boltAction type=\"file\" filePath=\"app/hello-world.tsx\">\nimport React from 'react'; \nimport { View, Text, StyleSheet } from 'react-native'; \n\nexport default function HelloWorldScreen() { \n  return ( \n    <View style={styles.container}> \n      <Text style={styles.text}>Hello World</Text> \n    </View> \n  ); \n} \n\nconst styles = StyleSheet.create({ \n  container: { \n    flex: 1, \n    justifyContent: 'center', \n    alignItems: 'center', \n    backgroundColor: '#fff', \n  }, \n  text: { \n    fontSize: 18, \n    color: '#333', \n  }, \n});\n  </boltAction>\n\n  <boltAction type=\"file\" filePath=\"app/_layout.tsx\">\nimport { Tabs } from 'expo-router'; \nimport React from 'react'; \nimport { Platform } from 'react-native'; \n\nimport { HapticTab } from '@/components/HapticTab'; \nimport { IconSymbol } from '@/components/ui/IconSymbol'; \nimport TabBarBackground from '@/components/ui/TabBarBackground'; \nimport { Colors } from '@/constants/Colors'; \nimport { useColorScheme } from '@/hooks/useColorScheme'; \n\nexport default function TabLayout() { \n  const colorScheme = useColorScheme(); \n\n  return ( \n    <Tabs\n      screenOptions={{\n        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,\n        headerShown: false,\n        tabBarButton: HapticTab,\n        tabBarBackground: TabBarBackground,\n        tabBarStyle: Platform.select({\n          ios: {\n            // Use a transparent background on iOS to show the blur effect\n            position: 'absolute',\n          },\n          default: {},\n        }),\n      }}> \n      <Tabs.Screen \n        name=\"index\" \n        options={{ \n          title: 'Home', \n          tabBarIcon: ({ color }) => <IconSymbol size={28} name=\"house.fill\" color={color} />, \n        }} \n      />\n      <Tabs.Screen\n        name=\"explore\"\n        options={{\n          title: 'Explore',\n          tabBarIcon: ({ color }) => <IconSymbol size={28} name=\"paperplane.fill\" color={color} />,\n        }}\n      />\n      <Tabs.Screen \n        name=\"hello-world\" \n        options={{ \n          title: 'Hello World', \n          tabBarIcon: ({ color }) => <IconSymbol size={28} name=\"beaker\" color={color} />, \n        }} \n      />  \n    </Tabs> \n  ); \n}\n  </boltAction>\n</boltArtifact> \n\nNow, when you run the app, you should see a new \"Hello World\" tab, and when you click on it, it will display a simple \"Hello World\" message on the screen.";
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
