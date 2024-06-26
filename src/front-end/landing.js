import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Avatar } from '@mui/material';
import logo from '../polypalLogo.svg';
import alexPP from './components/alexPP.jpeg';
import asealPP from './components/asealPP.png';
import jocelynPP from './components/Jocelyn.JPG';
import coryPP from './components/Cory.jpeg';
import "../Landing.css";
import Header from './components/polypalHeader';




function Landing() {


  const teamMembers = [
    { name: 'Alexander N. Chin', role: 'Software Engineer', email: 'anc202000@utdallas.edu', initials: 'AC', src: alexPP, linkedin: 'https://www.linkedin.com/in/alexander-n-chin/'},
    { name: 'Aseal Mohmand', role: 'Software Engineer', email: 'asm200011@utdallas.edu', initials: 'AM', src: asealPP, linkedin: 'https://www.linkedin.com/in/asealmohmand/'},
    { name: 'Jocelyn Heckenkamp', role: 'Software Engineer', email: 'jah190020@utdallas.edu', initials: 'JH', src: jocelynPP, linkedin: 'https://www.linkedin.com/in/jocelyn-heckenkamp-7790791b7/'},
    { name: 'Cory Harris', role: 'Software Engineer', email: 'clh200002@utdallas.edu', initials: 'CH', src: coryPP, linkedin: 'https://www.linkedin.com/in/corylharris/'}
  ];

  const waveStyles = [
    { animationDelay: '1s' },
    { animationDelay: '10s' },
    { animationDelay: '15s' }
  ];

  return (
    <>
      <div className='front-container'></div>
      <div className='wave-container'>
        {waveStyles.map((style, index) => (
          <div key={index} className='wave' style={style} />
        ))}
      </div>

      <Header />
      <Container maxWidth="lg" className="landing-container">

        <Grid container spacing={4} alignItems="center" className="intro-box">

          <Grid item xs={12} md={7}>
            <Typography variant="h2" component="h1" gutterBottom className="landing-title">
              PolyphonyPal
            </Typography>
            <Typography variant="h6"  className="landing-subtitle" sx={{ mb: 2 }}>
              Welcome to Polyphony Pal, the ultimate tool for mastering voice leading in music composition.
              Whether you're a student refining your harmonies or an instructor guiding others, Polyphony Pal empowers you with tools to help you follow voice leading rules.
              Detect errors effortlessly with our 4-part voice leading analysis, generate rich harmonies with our Roman numeral-based music generation,
              and complete 2-part musical phrases with our counterpoint feature. Explore music theory creatively and confidently with Polyphony Pal,
              transforming theoretical concepts into beautifully orchestrated compositions. Start composing with precision and inspiration today.
            </Typography>
            <Button variant="contained" component={Link} to="/results" className="get-started-btn"  >
              Get Started
            </Button>
          </Grid>

          {/* Logo */}
          <Grid item xs={12} md={5} className="logo-container">
            <img src={logo} alt="PolyphonyPal logo" className="landing-logo" />
          </Grid>
        </Grid>


        <Typography variant="h4" component="div" className="team-heading">
          Meet the Team
        </Typography>
        <Grid container spacing={0} className="team-grid-container">
        {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index} className="team-member">
              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                <Link to={member.linkedin} target="_blank">
                  <Avatar className="team-avatar" src={member.src} sx={{ width: 250, height: 250 }}>{member.initials}</Avatar>
                </Link>
              </Grid>
              <Typography variant="subtitle1" component="div" className="team-name">
                {member.name}
              </Typography>
              <Typography color="textSecondary" className="team-role">
                {member.role}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="team-email">
                {member.email}
              </Typography>
            </Grid>
          ))}
        </Grid>

      </Container>
    </>
  );
}

export default Landing;