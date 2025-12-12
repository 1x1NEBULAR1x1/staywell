"use client";

import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import classes from "./Contact.module.scss";

export const Contact = () => {
  const [form_data, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [is_submitting, setIsSubmitting] = useState(false);
  const [submit_status, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitStatus("success");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setSubmitStatus(null), 5000);
  };

  return (
    <div className={classes.contact_page}>
      {/* Hero Section */}
      <section className={classes.hero_section}>
        <div className={classes.hero_content}>
          <h1 className={classes.hero_title}>Get In Touch</h1>
          <p className={classes.hero_subtitle}>
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className={classes.container}>
        <div className={classes.content_grid}>
          {/* Contact Info */}
          <aside className={classes.contact_info}>
            <h2>Contact Information</h2>
            <p className={classes.info_description}>
              Feel free to reach out through any of these channels.
            </p>

            <div className={classes.info_items}>
              <div className={classes.info_item}>
                <div className={classes.icon_wrapper}>
                  <Mail size={24} />
                </div>
                <div className={classes.info_content}>
                  <h3>Email</h3>
                  <a href="mailto:info@staywell.com">info@staywell.com</a>
                  <a href="mailto:support@staywell.com">support@staywell.com</a>
                </div>
              </div>

              <div className={classes.info_item}>
                <div className={classes.icon_wrapper}>
                  <Phone size={24} />
                </div>
                <div className={classes.info_content}>
                  <h3>Phone</h3>
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                  <a href="tel:+1234567891">+1 (234) 567-891</a>
                </div>
              </div>

              <div className={classes.info_item}>
                <div className={classes.icon_wrapper}>
                  <MapPin size={24} />
                </div>
                <div className={classes.info_content}>
                  <h3>Address</h3>
                  <p>
                    123 Hospitality Street
                    <br />
                    Downtown District
                    <br />
                    City, State 12345
                  </p>
                </div>
              </div>

              <div className={classes.info_item}>
                <div className={classes.icon_wrapper}>
                  <Clock size={24} />
                </div>
                <div className={classes.info_content}>
                  <h3>Business Hours</h3>
                  <p>
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Contact Form */}
          <section className={classes.contact_form_section}>
            <div className={classes.form_header}>
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you shortly.</p>
            </div>

            <form className={classes.contact_form} onSubmit={handleSubmit}>
              <div className={classes.form_group}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form_data.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className={classes.form_group}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form_data.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className={classes.form_group}>
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form_data.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div className={classes.form_group}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={form_data.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {submit_status === "success" && (
                <div className={classes.success_message}>
                  <span>✓</span> Message sent successfully! We'll get back to
                  you soon.
                </div>
              )}

              {submit_status === "error" && (
                <div className={classes.error_message}>
                  <span>✗</span> Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                className={classes.submit_button}
                disabled={is_submitting}
              >
                {is_submitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
