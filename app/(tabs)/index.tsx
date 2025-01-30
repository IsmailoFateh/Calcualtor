import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Calculator() {
  const [result, setResult] = useState<string>('');
  const [expression, setExpression] = useState<string>('');
  const [showScientific, setShowScientific] = useState<boolean>(false);

  const handlePress = (value: string) => {
    if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === '=') {
      try {
        let formattedExpression = expression
          .replace(/\^/g, '**') // Replace ^ with JavaScript exponentiation
          .replace(/sin\(/g, 'Math.sin(Math.PI/180*') // Convert to radians
          .replace(/cos\(/g, 'Math.cos(Math.PI/180*')
          .replace(/tan\(/g, 'Math.tan(Math.PI/180*')
          .replace(/ln\(/g, 'Math.log(') // ln is natural log
          .replace(/log\(/g, 'Math.log10(') // log base 10
          .replace(/exp\(/g, 'Math.exp('); // exp function

        setResult(eval(formattedExpression).toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (['sin', 'cos', 'tan', 'ln', 'exp', 'log', 'x^y'].includes(value)) {
      if (value === 'x^y') {
        setExpression((prev) => prev + '^');
      } else {
        setExpression((prev) => prev + `${value}(`);
      }
    } else {
      setExpression((prev) => prev + value);
    }
  };

  const basicButtons: string[][] = [
    ['C', '⌫', '(', ')'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '%', '+'],
  ];

  const scientificButtons: string[] = ['sin', 'cos', 'tan', 'ln', 'exp', 'log', 'x^y'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.resultContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          <Text style={styles.expressionText}>{expression}</Text>
        </ScrollView>
        <Text style={styles.resultText}>{result}</Text>
      </View>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowScientific(!showScientific)}
      >
        <Text style={styles.toggleButtonText}>
          {showScientific ? 'Hide Scientific' : 'Show Scientific'}
        </Text>
      </TouchableOpacity>

      {showScientific && (
        <View style={styles.scientificContainer}>
          {scientificButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, styles.scientificButton]}
              onPress={() => handlePress(button)}
            >
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        {basicButtons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, buttonIndex) => (
              <TouchableOpacity
                key={buttonIndex}
                style={styles.button}
                onPress={() => handlePress(button)}
              >
                <Text style={styles.buttonText}>{button}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.equalsButton]}
            onPress={() => handlePress('=')}
          >
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 10,
  },
  expressionText: {
    fontSize: 28,
    color: '#fff',
  },
  resultText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00ff00',
  },
  buttonContainer: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#333',
    margin: 5,
    height: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  equalsButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#444',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scientificContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  scientificButton: {
    width: '30%',
  },
});
