"use client";

import { Award, Building2, Clock, Heart, MapPin, Users } from "lucide-react";
import classes from "./About.module.scss";

export const About = () => {
  return (
    <div className={classes.about_page}>
      {/* Hero Section */}
      <section className={classes.hero_section}>
        <div className={classes.hero_content}>
          <h1 className={classes.hero_title}>About StayWell</h1>
          <p className={classes.hero_subtitle}>
            Creating unforgettable experiences for families and travelers
            worldwide
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className={classes.story_section}>
        <div className={classes.container}>
          <div className={classes.section_header}>
            <h2>Our Story</h2>
            <div className={classes.divider}></div>
          </div>
          <div className={classes.story_content}>
            <p>
              Founded with a vision to redefine hospitality, StayWell has been
              providing exceptional accommodation experiences since our
              inception. We believe that every journey deserves a perfect place
              to call home, even if just for a night.
            </p>
            <p>
              Our carefully curated collection of apartments combines comfort,
              style, and convenience, ensuring that whether you're traveling for
              business or pleasure, you'll find your ideal sanctuary with us.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={classes.values_section}>
        <div className={classes.container}>
          <div className={classes.section_header}>
            <h2>Our Values</h2>
            <div className={classes.divider}></div>
          </div>
          <div className={classes.values_grid}>
            <div className={classes.value_card}>
              <div className={classes.icon_wrapper}>
                <Heart size={32} />
              </div>
              <h3>Hospitality First</h3>
              <p>
                We treat every guest like family, ensuring comfort and care in
                every interaction.
              </p>
            </div>

            <div className={classes.value_card}>
              <div className={classes.icon_wrapper}>
                <Award size={32} />
              </div>
              <h3>Excellence</h3>
              <p>
                We maintain the highest standards in cleanliness, amenities, and
                service quality.
              </p>
            </div>

            <div className={classes.value_card}>
              <div className={classes.icon_wrapper}>
                <Users size={32} />
              </div>
              <h3>Community</h3>
              <p>
                We foster connections between guests and local culture for
                authentic experiences.
              </p>
            </div>

            <div className={classes.value_card}>
              <div className={classes.icon_wrapper}>
                <Building2 size={32} />
              </div>
              <h3>Quality Spaces</h3>
              <p>
                Each property is carefully selected and designed to provide
                maximum comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={classes.stats_section}>
        <div className={classes.container}>
          <div className={classes.stats_grid}>
            <div className={classes.stat_item}>
              <div className={classes.stat_number}>2500+</div>
              <div className={classes.stat_label}>Happy Guests</div>
            </div>
            <div className={classes.stat_item}>
              <div className={classes.stat_number}>200+</div>
              <div className={classes.stat_label}>Premium Properties</div>
            </div>
            <div className={classes.stat_item}>
              <div className={classes.stat_number}>788</div>
              <div className={classes.stat_label}>Unique Experiences</div>
            </div>
            <div className={classes.stat_item}>
              <div className={classes.stat_number}>24/7</div>
              <div className={classes.stat_label}>Guest Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className={classes.location_section}>
        <div className={classes.container}>
          <div className={classes.location_content}>
            <div className={classes.location_info}>
              <div className={classes.icon_wrapper}>
                <MapPin size={40} />
              </div>
              <h2>Visit Us</h2>
              <p className={classes.address}>
                123 Hospitality Street
                <br />
                Downtown District
                <br />
                City, State 12345
              </p>
              <div className={classes.hours}>
                <Clock size={20} />
                <div>
                  <strong>Office Hours:</strong>
                  <br />
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
