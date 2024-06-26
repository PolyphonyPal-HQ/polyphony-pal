import React from 'react';
import {  Button, Grid, Link } from '@mui/material';
import logo from '../../polypalLogo.svg';

function Header()
{
    return(
    <Grid container  mb={-4} >
      <Grid item  xs={2} md={2} lg={2} mt={-6}  >

      <Link href="/"><img src={logo} alt="polypal logo"  style={{ width: "200px", height: "200px" }}  /></Link>
      </Grid>

      
      <Grid container item xs={10} md={10} lg={10} pt={4.6} className="navigation-buttons" justifyContent="end">
        <Grid item >
        <Link href="/"><Button size="large" sx={{ color: "black" }}>About</Button></Link>
        <Link href="/generation"><Button size="large" sx={{ color: "black" }}>Generate</Button></Link>  
        <Link href="/counterpoint"><Button size="large" sx={{ color: "black" }}>Counterpoint</Button></Link>                
        <Link href="/results"><Button size="large" sx={{ color: "black" }}>Upload</Button> </Link>
        </Grid>
      </Grid>
  </Grid>
    );
}
export default Header;