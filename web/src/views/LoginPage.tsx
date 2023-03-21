import React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import type { Engine } from 'tsparticles-engine'
import { loadFull } from 'tsparticles'
import { useDispatch } from 'react-redux'
import { loginUser } from '../state/reducers/loginSlice'


const LoginPage = () => {

    const dispatch = useDispatch()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        if (
            data.get('username') == null ||
            data.get('username') == ''
        ) {
            return
        }

        dispatch(loginUser(
            data.get('username')?.toString() || ''
        ))

    }

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine)
    }, [])


    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
            >
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    options={{
                        background: {
                            color: {
                                value: '#1D232A',
                            },
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: 'repulse',
                                },
                                resize: true,
                            },
                            modes: {
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            number: {
                                value: 30,
                                density: {
                                    enable: true,
                                    value_area: 850
                                }
                            },
                            color: {
                                value: '#3CA9D1'
                            },
                            shape: {
                                type: 'circle',
                                stroke: {
                                    width: 0,
                                    color: '#000000'
                                },
                                polygon: {
                                    nb_sides: 5
                                },
                            },
                            opacity: {
                                value: 0.5,
                                random: false,
                                anim: {
                                    enable: false,
                                    speed: 1,
                                    opacity_min: 0.1,
                                    sync: false
                                }
                            },
                            size: {
                                value: 4,
                                random: true,
                                anim: {
                                    enable: false,
                                    speed: 40,
                                    size_min: 0.1,
                                    sync: false
                                }
                            },
                            line_linked: {
                                enable: true,
                                distance: 150,
                                color: '#3CA9D1',
                                opacity: 0.4,
                                width: 1
                            },
                            move: {
                                enable: true,
                                speed: 1,
                                direction: 'none',
                                random: false,
                                straight: false,
                                out_mode: 'out',
                                bounce: false,
                                attract: {
                                    enable: false,
                                    rotateX: 600,
                                    rotateY: 1200
                                }
                            }
                        },
                        retina_detect: true
                    }}
                />

            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{ zIndex: 1 }}>
                <Box
                    sx={{
                        my: 18,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
            
                    <Avatar />
                    <Typography component="h1" variant="h5">
              Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}


export default LoginPage