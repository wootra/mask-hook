import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

type MaskScreenProps = {
  title: string;
  description: string;
  placeholder: string;
  storedValue: string;
  displayedValue: string;
  digitCount: number;
  isDirty: boolean;
  isNumberVisible: boolean;
  canEyeIconVisible: boolean;
  setIsNumberVisible: (value: boolean) => void;
  onChangeText: (value: string) => void;
  handleInputFocused: () => void;
  handleInputBlurred: () => void;
};

export function MaskScreen({
  title,
  description,
  placeholder,
  storedValue,
  displayedValue,
  digitCount,
  isDirty,
  isNumberVisible,
  canEyeIconVisible,
  setIsNumberVisible,
  onChangeText,
  handleInputFocused,
  handleInputBlurred,
}: MaskScreenProps) {
  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>demo-rn-expo</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <TextInput
            keyboardType="number-pad"
            onBlur={handleInputBlurred}
            onChangeText={onChangeText}
            onFocus={handleInputFocused}
            placeholder={placeholder}
            style={styles.input}
            value={displayedValue}
          />
          <Pressable
            disabled={!canEyeIconVisible}
            onPress={() => setIsNumberVisible(!isNumberVisible)}
            style={[styles.button, !canEyeIconVisible && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>{isNumberVisible ? 'Hide digits' : 'Show digits'}</Text>
          </Pressable>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Stored value</Text>
              <Text style={styles.statValue}>{storedValue || 'empty'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Digits</Text>
              <Text style={styles.statValue}>{digitCount}/9</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Visibility</Text>
              <Text style={styles.statValue}>{isNumberVisible ? 'Visible' : 'Masked'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Dirty state</Text>
              <Text style={styles.statValue}>{isDirty ? 'Modified' : 'Initial value'}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5efe6',
    padding: 20,
  },
  card: {
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 14,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#8a4b2d',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1d293d',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#506176',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6dde6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 22,
    letterSpacing: 1.5,
    backgroundColor: '#fdfbf8',
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#1d293d',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fffdf9',
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#f5efe6',
    padding: 14,
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#8a4b2d',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    color: '#1d293d',
  },
});