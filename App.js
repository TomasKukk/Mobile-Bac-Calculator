import React, { Component } from 'react';
import { StyleSheet, Text, View, Slider, Button, Image, TouchableOpacity } from 'react-native';


const styles = StyleSheet.create({
  Blinker: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 50
  },
  Slider: {
    width: 300,
  },
  ValueKg: {
    justifyContent: 'center'
  }
})


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      configComplete: false,
      beers: 0,
      gender: 'Male',
      val: 50,
      BAC: 0,
      firstBeerDate: null,
      lastBeerDate: new Date(),
    }

    setInterval(() => {
      this.calculateBAC()
    }, 1000);
  }

  handleConfig = () => {
    this.setState({ configComplete: !this.state.configComplete})
  }

  calculateBAC = () => {

    
    const now = new Date()

    const differenceInMillis = now - this.state.lastBeerDate

    const diffMins = Math.round(((differenceInMillis % 86400000) % 3600000) / 60000)

    console.log(diffMins)

    const r = this.state.gender === 'Male' ? 0.55 : 0.68


    let alcoholDose = this.state.beers * 15.5


    let bodyWeightWithConstant = (this.state.val * 1000) * r 
    

    let divide = (alcoholDose) / bodyWeightWithConstant


    let result = ((divide) * 1000) - ((diffMins * 0.00025) * 10) 
    

    this.setState({ BAC: result < 0 ? 0 : result })
  }

  drinkBeer = () => {
    let beers = this.state.beers
    if (beers === 0) {
      this.setState({ firstBeerDate: new Date()})
    }
    this.setState({ beers: beers + 1, lastBeerDate: new Date() })
  }

  handleGenderChange = () => {
    this.setState({ gender: 
    this.state.gender === 'Male' ? 
    'Female' : 'Male' })
  }

  handleValueChange = ( val ) => {
    this.setState({ val: val })
  }

  render() {
    if (!this.state.configComplete)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
      <View style={{ flex: 1, marginTop: 100  }}>
        <CustomSlider 
          handleValueChange={this.handleValueChange.bind(this)}
          value={this.state.val.toFixed(0)}
        ></CustomSlider>
        <Gender
        gender={this.state.gender} 
        handleGenderChange={this.handleGenderChange.bind(this)}
        ></Gender>
        </View>
        <Button 
        style={{flex: 2}}
        onPress={this.handleConfig}
        title="Start drinking!"
        ></Button>
      </View>
    );

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hey {this.state.gender} who weights {this.state.val.toFixed(0)} kg</Text>
        <Button 
          onPress={this.handleConfig}
          title="Back to configuration"
        ></Button>
        <TouchableOpacity
          onPress={this.drinkBeer}>
          <Image
            source={require('./beerIcon.png')}
          ></Image>
        </TouchableOpacity>
        <Text style={{ fontSize: 30 }}>Beers so far: {this.state.beers}</Text>

        <Button 
          onPress={() => this.setState({ beers: 0, BAC: 0 })}
          title="Nollaa"
        ></Button>

        <Text style={{ fontSize: 20, marginTop: 30 }}>Blood alcohol: {this.state.BAC.toFixed(2)} promillea</Text>
      </View>
    )
  }
}

const Gender = ({ gender, handleGenderChange }) => { 

    return(
      <Button
        onPress={handleGenderChange}
        title={gender}
        >
      </Button>
    )
  }

const CustomSlider = ({ value, handleValueChange }) => {
    return (
      <View style={{ justifyContent: 'center' }}>
      <Slider style={styles.Slider} 
      minimumValue={50} 
      maximumValue={100} 
      onValueChange={value => handleValueChange(value)}></Slider>
      <Text>{value} Kg</Text>
      </View>
    )
  }

