import styles from "./tooltip.module.css";

//Component to display the tooltip if there is an interaction with the datapoints
export const Tooltip = ({ InteractionData }) => {
  if (!InteractionData.name) {
    return null;
  }
  return (
    <div
      className={styles.tooltip}
      style={{
        left: InteractionData.xPos,
        top: InteractionData.yPos,
      }}
    >
      <p>The Cell Name: {InteractionData.name}</p>
      <p>The Cell Type: {InteractionData.type}</p>
    </div>
  );
};
