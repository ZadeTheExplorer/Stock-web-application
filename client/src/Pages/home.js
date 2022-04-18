import React from 'react';
import SearchBar from "../components/SearchBar";
import QueryTable from "../components/QueryTable";

import { DataProvider} from '../components/Context';
import { Container } from 'react-bootstrap';

export default function Home(){

    return(
        <DataProvider>
            <div className="Home">
                <h1> STOCK PRICES</h1>
                <Container style={{backgroundColor: 'black', borderRadius: '10px', width: '450px'}}>
                    Welcome to the Stock Analyst portal!<br/>
                    Start browsering industry by typing in the search box,<br/>
                    Or choosing from the dropdown selection.<br/>
                    By default, there are 495 companies of 11 industries displayed in the table.
                </Container>
                <br/>
                <SearchBar />
                <QueryTable />
            </div>
        </DataProvider>
    );  
}