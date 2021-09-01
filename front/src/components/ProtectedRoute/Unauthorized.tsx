import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { BeatLoader } from 'react-spinners';


const Container = styled.div`
  text-align: center;
  font-size: 1.3rem;
  margin-top: 100px;
}`

const MessageContainer = styled.div`
  text-align: center;
  font-size: 1.3rem;
`

const H1Container = styled.h1`
  font-size: 2.5rem;
`

const Unauthorized = () => {
  return (
    <Container>
      <BeatLoader size={50} color={'#5786AD'} />
      <MessageContainer>
        <H1Container>403 - You Shall Not Pass</H1Container>
        <p>Uh oh, You way had been block!<br />Maybe you have a typo in the url? Or you meant to go to a different location?</p>
      </MessageContainer>
      <p><Link to='/'>Back to Home</Link></p>
    </Container>
  )
}

export default Unauthorized;