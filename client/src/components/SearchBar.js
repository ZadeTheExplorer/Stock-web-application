import React, {useState, useContext, useEffect } from 'react';
import {DataContext} from './Context';
import {Alert, Container} from 'react-bootstrap';


function handlerErrors(response){
    if(!response.ok)
      throw Error(response.statusText);
    return response;
}

function SearchBar() {
  const [innerSearch, setInnerSearch] = useState('');
  const  setRowData = useContext(DataContext)[1];
  const [error, setError] = useState({status: false, message: ''});

  const onChangeHandler = e =>{
      setInnerSearch(e.target.value);
      console.log('search state set!');
  }

  useEffect(() => {
    if(innerSearch === '') {
        fetch("http://131.181.190.87:3000/stocks/symbols")
        .then(res => res.json())
        .then(datas => setRowData(datas));
      }
      else {
        fetch(`http://131.181.190.87:3000/stocks/symbols?industry=${innerSearch}`)
        .then(handlerErrors)
        .then(res => res.json())
        .then(datas => {setRowData(datas); setError(prev => {return{status: false, message: prev.message}})})
        .catch(e => setError(prev => {return{status: true, message: e.message}}))
    }
  },[innerSearch, setRowData]);

  const updateAlert = () => {
    if (error.status) {
      return (
        <Container>
          <Alert variant="danger" onClose={() => {setInnerSearch(''); setError(prev => {return{status: false, message: prev.message}})}} dismissible>
          <Alert.Heading>{error.message}</Alert.Heading>
          <p>
            {`Can not find industry: ${innerSearch}.`}
          </p>
          <p>Please try to input again or select an industry in the dropdown selection</p>
        </Alert>
        </Container>
        
      );
    } else{
      return (
        <Container style={{backgroundColor: 'black', borderRadius: '10px', width: '300px', paddingBottom: '0.25px'}}>
          <p>Click on row to see data!!</p>
        </Container>
    );}
  }
  return (
      <div className='searchContainer'>
      <form>
      <input
          aria-labelledby="search-button"
          name="search"
          id="search"
          type="search"
          style={{
            borderRadius: '5px',
            borderColor: '#b2ed1c',
            outline: 'none'
          }}
          placeholder="search for industry"
          value={innerSearch}
          onChange={onChangeHandler}
      />
      {' '}
      <label>OR</label>
      {' '}
      <select 
        style={{
          borderRadius: '5px',
          borderColor: '#b2ed1c',
          outline: 'none'
        }} 
        value={innerSearch}
        onChange={onChangeHandler}>

        <option value=''>All industries</option>
        <option value='Health Care'>Health Care</option>
        <option value='Financials'>Financials</option>
        <option value='Industrials'>Industrials</option>
        <option value='Real Estate'>Real Estate</option>
        <option value='Consumer discretionary'>Consumer discretionary</option>
        <option value='Materials'>Materials</option>
        <option value='Information Technology'>Information Technology</option>
        <option value='Energy'>Energy</option>
        <option value='Consumer Staples'>Consumer Staples</option>
        <option value='Telecommunication Services'>Telecommunication Services</option>
        <option value='Utilities'>Utilities</option>
      </select>
      </form>
      {updateAlert()}
      </div>
  );
}

export default SearchBar;