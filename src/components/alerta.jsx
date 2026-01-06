import { Alert } from "react-native";

export function asyncAlert({ title, message, textYes = "Sim", textNo = "Não" }) {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: textNo,
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: textYes,
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false },
    );
  });
}

export function alerta({
  title,
  message,
  textYes = "SIM",
  textNo = "NÃO",
  onYes,
  onNo,
  cancelable = false,
}) {
  Alert.alert(
    title,
    message,
    [
      {
        text: textNo,
        style: "cancel",
        onPress: () => onNo && onNo(),
      },
      {
        text: textYes,
        onPress: () => onYes && onYes(),
      },
    ],
    { cancelable: cancelable },
  );
}
