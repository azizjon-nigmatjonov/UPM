import "./style.scss";

const FRow = ({ label, children, position = "horizontal", labelStyle }) => {
  return (
    <div className={`FRow ${position}`}>
      <div className="label" style={{ ...labelStyle }}>
        {label ? label + ":" : ""}
      </div>
      <div className="component">{children}</div>
    </div>
  );
};

export default FRow;
