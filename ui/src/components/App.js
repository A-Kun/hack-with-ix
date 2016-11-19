// Dependencies

import React, { Component } from 'react'

// Components

import { Center } from 'components/Flex'
import { Button } from 'semantic-ui-react'
import Chart from 'components/Chart'

export default class App extends Component {
  constructor () {
    super()
  }

  render () {
    return (
      <Center>
        <Chart/>
      </Center>
    )
  }
}
