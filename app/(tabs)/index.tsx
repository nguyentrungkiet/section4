import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, FlatList, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [enteredNumber, setEnteredNumber] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [targetNumber, setTargetNumber] = useState(0);
  const [guesses, setGuesses] = useState<number[]>([]);
  const [numOfGuesses, setNumOfGuesses] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (gameStarted) {
      setGuesses([]);
      setNumOfGuesses(0);
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [gameStarted]);

  const numberInputHandler = (inputText: string) => {
    setEnteredNumber(inputText);
  };

  const resetInputHandler = () => {
    setEnteredNumber('');
  };

  const confirmInputHandler = () => {
    const chosenNumber = parseInt(enteredNumber);
    if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
      Alert.alert(
        'Số không hợp lệ!',
        'Số phải là một số từ 1 đến 99.',
        [{ text: 'Okay', style: 'destructive', onPress: resetInputHandler }]
      );
      return;
    }
    setGameStarted(true);
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
  };

  const makeGuessHandler = () => {
    const guess = parseInt(enteredNumber);
    if (isNaN(guess) || guess <= 0 || guess > 99) {
      Alert.alert('Số không hợp lệ!', 'Vui lòng nhập số từ 1 đến 99.');
      return;
    }

    setNumOfGuesses(prevNum => prevNum + 1);
    setGuesses(prevGuesses => [guess, ...prevGuesses]);

    if (guess === targetNumber) {
      Alert.alert('Chúc mừng!', `Bạn đã đoán đúng sau ${numOfGuesses + 1} lần!`, [
        { text: 'Chơi lại', onPress: () => setGameStarted(false) }
      ]);
    } else if (guess < targetNumber) {
      Alert.alert('Thấp quá!', 'Hãy thử số lớn hơn.');
    } else {
      Alert.alert('Cao quá!', 'Hãy thử số nhỏ hơn.');
    }
    setEnteredNumber('');
  };

  const renderGuessItem = ({ item, index }: { item: number; index: number }) => (
    <Animated.View style={[styles.guessItem, { opacity: fadeAnim }]}>
      <Text style={styles.guessText}>Lần đoán #{guesses.length - index}: {item}</Text>
    </Animated.View>
  );

  let content = (
    <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Bắt đầu trò chơi mới</Text>
      <TextInput
        style={styles.input}
        blurOnSubmit
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        maxLength={2}
        onChangeText={numberInputHandler}
        value={enteredNumber}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={resetInputHandler}>
          <LinearGradient colors={['#ff6b6b', '#ee5253']} style={styles.gradient}>
            <Text style={styles.buttonText}>Reset</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={confirmInputHandler}>
          <LinearGradient colors={['#54a0ff', '#2e86de']} style={styles.gradient}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (gameStarted) {
    content = (
      <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Đoán số của tôi!</Text>
        <Text style={styles.subtitle}>Số lần đoán: {numOfGuesses}</Text>
        <TextInput
          style={styles.input}
          blurOnSubmit
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          maxLength={2}
          onChangeText={numberInputHandler}
          value={enteredNumber}
        />
        <TouchableOpacity style={styles.guessButton} onPress={makeGuessHandler}>
          <LinearGradient colors={['#54a0ff', '#2e86de']} style={styles.gradient}>
            <Text style={styles.buttonText}>Đoán</Text>
          </LinearGradient>
        </TouchableOpacity>
        <FlatList
          data={guesses}
          renderItem={renderGuessItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animated.View>
    );
  }

  return (
    <LinearGradient colors={['#a55eea', '#8854d0']} style={styles.screen}>
      {content}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 10,
    width: '100%',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: '45%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guessButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 10,
  },
  guessItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  guessText: {
    fontSize: 16,
  },
});
