import React from "react";
import { StyleSheet, Text, View } from "react-native";

var t = require('tcomb-form-native');

const Form = t.form.form;

const FormOne = t.struct({
  stringInput: t.String,              // a required string
  stringInput_Optional: t.maybe(t.String),  // an optional string
  numberInput: t.Number,               // a required number
  checkboxInput: t.Boolean        // a boolean
});

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    },
  },
  controlLabel: {
    normal: {
      color: 'blue',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    },
    // the style applied when a validation error occours
    error: {
      color: 'red',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    }
  }
}

const options = {
  fields: {
    email: {
      error: 'errorMsg for email'
    },
    password: {
      error: 'errorMsg for password'
    },
    terms: {
      label: 'errorMsg for terms',
    },
  },
  stylesheet: formStyles,
};


export default class Forms extends React.Component {
  render() {
    return <Text>Forms</Text>
    <Form type = {FormOne} options = {options}/>
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
//reference materials: 
//https://medium.com/react-native-development/easily-build-forms-in-react-native-9006fcd2a73b
//https://github.com/gcanti/tcomb-form-native
