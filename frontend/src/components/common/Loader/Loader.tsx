import classes from "./Loader.module.scss";

type LoaderProps = {
  size?: "small" | "medium" | "large";
  text?: string;
  fullPage?: boolean;
};

export const Loader = ({
  size = "medium",
  text,
  fullPage = false,
}: LoaderProps) => {
  const loader_content = (
    <div className={`${classes.loader_container} ${classes[size]}`}>
      <div className={classes.spinner}></div>
      {text && <p className={classes.loader_text}>{text}</p>}
    </div>
  );

  if (fullPage) {
    return <div className={classes.fullpage_wrapper}>{loader_content}</div>;
  }

  return loader_content;
};
