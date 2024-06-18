import "./style.scss";

const FiltersBlock = ({
  children,
  extra,
  styles = { "backgroundColor": "#fff", height: "70px" },
}) => {
  return (
    <div className={`FiltersBlock silver-bottom-border`} style={styles}>
      <div className="side">{children}</div>
      <div className="side">
        {" "}
        {extra && extra?.map((item, idx) => <div key={idx}>{item}</div>)}{" "}
      </div>
    </div>
  );
};

export default FiltersBlock;
