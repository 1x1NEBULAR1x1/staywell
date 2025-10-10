import classes from './page.module.scss';

import ic_traveler from '@/../public/pages/home/ic-traveler.png';
import ic_treasure from '@/../public/pages/home/ic-treasure.png';
import ic_cities from '@/../public/pages/home/ic-cities.png';

import hero_banner from '@/../public/pages/home/main-hero-image.jpg';

import luxury_suite from '@/../public/pages/home/rooms/room-luxury-suite.jpg';
import budget_room from '@/../public/pages/home/rooms/room-budget-room.jpg';
import superior_room from '@/../public/pages/home/rooms/room-superior-room.jpg';
import executive_room from '@/../public/pages/home/rooms/room-executive-room.jpg';
import standard_room from '@/../public/pages/home/rooms/room-standard-room.jpg';

import relax_pool from '@/../public/pages/home/features/feature-relax-pool.jpg';
import tranquility_zone from '@/../public/pages/home/features/feature-tranquility-zone.jpg';
import green_villa from '@/../public/pages/home/features/feature-green-villa.jpg';
import private_dinner_experience from '@/../public/pages/home/features/feature-private-dinner-experience.jpg';
import main_pool from '@/../public/pages/home/features/feature-main-pool.jpg';
import modern_fitness_room from '@/../public/pages/home/features/feature-modern-fitness-room.jpg';
import conference_room from '@/../public/pages/home/features/feature-conference-room.jpg';
import view_from_the_window from '@/../public/pages/home/features/feature-view-from-the-window.jpg';

import { CalendarDays, ChevronDown, Hotel, UserRoundPen } from 'lucide-react';

export default async function page() {
    return (
        <div className={classes.page}>

        <section className={classes.section_hero}>

            <div className={classes.about}>

                <h1 className={classes.title}>Feel the Breeze, <br />Live with Ease</h1>

                <p className={classes.description}>Create lasting memories with your family — <br />comfort, fun, and sunshine included. <br />We’ll be happy to welcome you and make your stay truly special.</p>

                <button className={classes.button}>Show More</button>

                <div className={classes.metrics}>

                    <div className={classes.item}>

                        <img src={ic_traveler.src} alt="Traveler" width={24} height={24} />

                        <span className={classes.title}>2500<span>Users</span></span>

                    </div>

                    <div className={classes.item}>

                        <img src={ic_treasure.src} alt="Treasure" width={24} height={24} />

                        <span className={classes.title}>200 <span>Treasures</span></span>

                    </div>

                    <div className={classes.item}>

                        <img src={ic_cities.src} alt="Cities" width={24} height={24} />

                        <span className={classes.title}>788 <span>Points</span></span>

                    </div>

                </div>

                </div>

                <div className={classes.banner}>

                    <div className={classes.image}>
                        <img src={hero_banner.src} alt="Hero Banner" width={520} height={410} />
                    </div>

                <div className={classes.frame}></div>

            </div>

        </section>

        <section className={classes.section_filters}>

            <div className={classes.buttons}>

                <button className={classes.button}>
                    <CalendarDays />
                    <p> Check Available </p>
                </button>

                <button className={classes.button}>
                    <UserRoundPen />
                    <p>Person </p>
                    <p> 2</p>
                    <ChevronDown />
                </button>

                <button className={classes.button}>
                    <Hotel/>
                    <p > Room Category </p>
                </button>

            </div>

            <button className={classes.search_button}> Search </button>

        </section>

        <section className={classes.section_recommendations}>

            <p className={classes.title}> Most Picked </p> 

            <div className={classes.images_container} >

                <div className={classes.left_image}>
                    <a className={classes.image} href="#">
                        <div className={classes.badge}> $40 <p className={classes.pernight}>per night</p></div>
                        <div className={classes.room_title}>Luxury Suite</div>
                        <img src={luxury_suite.src} alt="Luxury Suite"/>
                    </a>
                </div>

                <div className={classes.center_images}>

                    <a className={classes.center_images_top_image} href="#">
                        <div className={classes.badge}>$22 <p className={classes.pernight}>per night</p></div>
                        <div className={classes.room_title}>Budget Room</div>
                        <img src={budget_room.src} alt="Budget Room"/>
                    </a>

                    <a className={classes.center_images_bottom_image} href="#">
                        <div className={classes.badge}>$31 <p className={classes.pernight}>per night</p></div>
                        <div className={classes.room_title}>Budget Room</div>
                        <img src={superior_room.src} alt="Superior Room"/>
                    </a>

                </div>

                <div className={classes.right_images}>

                    <a className={classes.right_images_top_image} href="#">
                        <div className={classes.badge}>$49 <p className={classes.pernight}>per night</p></div>
                        <div className={classes.room_title}>Executive Room</div>
                        <img src={executive_room.src} alt="Executive Room"/>
                    </a>
                    
                    <a className={classes.right_images_bottom_image} href="#">
                        <div className={classes.badge}>$28 <p className={classes.pernight}>per night</p></div>
                        <div className={classes.room_title}>Standard Room</div>
                        <img src={standard_room.src} alt="Standard Room"/>
                    </a>

                </div>
            
            </div>

        </section>

        <section className={classes.section_features}>
        
            <div className={classes.features_group_columns}>

                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={relax_pool.src} alt="Relax Pool" />
                    </div>
                    <p className={classes.title} > Relax Pool </p>
                </div>

                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={tranquility_zone.src} alt="Tranquility Zone" />
                    </div>
                    <p className={classes.title} > Tranquility Zone </p>
                </div>

                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={green_villa.src} alt="Green Villa" />
                    </div>
                    <p className={classes.title} > Green Villa </p>
                </div>

                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={private_dinner_experience.src} alt="Private Dinner Experience" />
                    </div>
                    <p className={classes.title} > Private Dinner Experience </p>
                </div>

            </div>

            <div className={classes.features_group_columns}>
                
                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={main_pool.src} alt="Main Pool" />
                    </div>
                    <p className={classes.title} > Main Pool </p>
                </div>

                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={modern_fitness_room.src} alt="Modern Fitness Room" />
                    </div>
                    <p className={classes.title} > Modern Fitness Room </p>
                </div>

                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={conference_room.src} alt="Conference Room" />
                    </div>
                    <p className={classes.title} > Conference Room </p>
                </div>

                <div className={classes.feature_group}>
                    <div className={classes.image}>
                        <img src={view_from_the_window.src} alt="View from the Window" />
                    </div>
                    <p className={classes.title} > View from the Window </p>
                </div>

            </div>

        </section>

        </div>
    )
}