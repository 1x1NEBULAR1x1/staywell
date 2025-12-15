import Image from "next/image";
import hero_image from "@/../public/pages/home/hero-image.jpg";
import { Logo } from "@/components/common/Logo";
import classes from "../AuthPage.module.scss";
import { Form } from "./components/Form";

export const Register = () => {
  return (
    <div className={classes.page}>
      <div className={classes.image_container}>
        <Image
          src={hero_image.src}
          alt="Hero Image"
          quality={100}
          width={1200}
          height={1200}
          className={classes.image}
        />
        <div className={classes.logo_container}>
          <Logo className={classes.logo} />
        </div>
      </div>
      <div className={classes.form_container}>
        <h3 className={classes.from_title}>Create an account</h3>
        <Form />
      </div>
    </div>
  );
};
