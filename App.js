import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  picker: {
    height: 50,
    width: 150,
    marginVertical: 20,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  scrollView: {
    width: '100%',
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: '#FF6666',
    textAlign: 'center',
    padding: 10,
    marginVertical: 5,
  },
});

class HttpExample extends Component {
  state = {
    data: [],
    translatedData: [],
    selectedLanguage: 'en', // Default language is English
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('http://10.0.2.2/tips', {
      method: 'GET',
    })
      .then((response) => {
        console.log('Fetch Data Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((responseJson) => {
        console.log('Fetch Data Response JSON:', responseJson);
        this.setState({
          data: responseJson.tips,
          translatedData: responseJson.tips, // Initially show original data
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.setState({ error: error.message });
      });
  };

  handleLanguageChange = (selectedLanguage) => {
    this.setState({ selectedLanguage, loading: true, error: null }, () => {
      this.fetchTranslatedData(selectedLanguage);
    });
  };

  fetchTranslatedData = (selectedLanguage) => {
    const { data } = this.state;

    if (!data.length) return;

    const formattedData = data.map((item) => item.replace(/\n/g, ' '));

    const requestBody = {
      content: formattedData,
      language: selectedLanguage,
    };
    console.log('Fetch Translated Data Request Body:', requestBody);

    fetch('http://10.0.2.2:80/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Properly stringify the request body
    })
      .then((response) => {
        console.log('Fetch Translated Data Response Status:', response.status);
        return response.json().then((data) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
          return data;
        });
      })
      .then((translatedData) => {
        console.log('Fetch Translated Data Response JSON:', translatedData);
        this.setState({ translatedData: translatedData.translated_text, loading: false });
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
        this.setState({ error: error.message, loading: false });
      });
  };

  render() {
    const { translatedData, selectedLanguage, loading, error } = this.state;

    return (
      <View style={styles.container}>
        <Picker
          selectedValue={selectedLanguage}
          style={styles.picker}
          onValueChange={this.handleLanguageChange}
        >
          <Picker.Item label="Assamese" value="as" />
          <Picker.Item label="Awadhi" value="awa" />
          <Picker.Item label="Bengali" value="bn" />
          <Picker.Item label="Bhojpuri" value="bho" />
          <Picker.Item label="Chhattisgarhi" value="chg" />
          <Picker.Item label="Dogri" value="doi" />
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Gujarati" value="gu" />
          <Picker.Item label="Haryanvi" value="hne" />
          <Picker.Item label="Hindi" value="hi" />
          <Picker.Item label="Kannada" value="kn" />
          <Picker.Item label="Kashmiri" value="ks" />
          <Picker.Item label="Konkani" value="kok" />
          <Picker.Item label="Maithili" value="mai" />
          <Picker.Item label="Malayalam" value="ml" />
          <Picker.Item label="Manipuri" value="mni" />
          <Picker.Item label="Marathi" value="mr" />
          <Picker.Item label="Nepali" value="ne" />
          <Picker.Item label="Odia" value="or" />
          <Picker.Item label="Punjabi" value="pa" />
          <Picker.Item label="Sanskrit" value="sa" />
          <Picker.Item label="Santali" value="sat" />
          <Picker.Item label="Sindhi" value="sd" />
          <Picker.Item label="Tamil" value="ta" />
          <Picker.Item label="Telugu" value="te" />
          <Picker.Item label="Urdu" value="ur" />
        </Picker>
        <View style={styles.scrollContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollView}>
              {translatedData.map((item, index) => (
                <Text key={index} style={styles.bigBlue}>
                  {item}
                </Text>
              ))}
            </ScrollView>
          )}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </View>
      </View>
    );
  }
}

export default HttpExample;
