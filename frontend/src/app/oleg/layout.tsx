import classes from './HeadAndFoot.module.scss';


export default async function layout({ children }: { children: React.ReactNode }) {
    
    return (
        <>

            <header className={classes.header}>
                <div className={classes.header_left}>

                    <a href='/' className={classes.logo}> <p className={classes.logo_main} > Stay </p> <p className={classes.logo_dark}> Well </p> </a>
                    
                </div>
                
                <div className={classes.header_right}>

                    <div className={classes.links}>

                        <a className={classes.link_active} href="/">Home</a>    
                        <a className={classes.link} href="/contact">Event</a>
                        <a className={classes.link} href="/contact">Rooms</a>
                        <a className={classes.link} href="/about">About</a>
                        <a className={classes.link} href="/contact">Contact</a>
                        
                    </div>

                    <a className={classes.login_button} href="/login">Login</a>
                    
                </div>
                
            </header>

            {children}
            
            <footer className={classes.footer}>

                <div className={classes.footer_top}> 
                    

                    <div className={classes.footer_top_left}>
                        
                        <a href='/' className={classes.logo}> <p className={classes.logo_main} > Stay </p> <p className={classes.primary_dark}> Well </p> </a>
                        <p className={classes.add_text}> Looking forward to seeing you —<br /> your perfect getaway starts with us. </p>

                    </div>

                    <div className={classes.footer_top_right}> 

                        <p className={classes.text}> Become hotel Owner </p>

                        <a className={classes.register_button} href="/login">Register Now</a>

                    </div>

                 </div>

                 <div className={classes.footer_bottom}> 
                    
                    Copyright 2025 • All rights reserved   
                    
                </div>

            </footer>
        </>
    )
}