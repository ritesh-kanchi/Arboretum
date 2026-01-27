import { JSX, useState } from "react";
import Dropdown from "./Dropdown";
import Button from "./Button";

type ClickDropdownItem = {
  icon: JSX.Element;
  name: string;
  onClick: () => void;
};

export function ClickDropdown({
  text,
  action,
  items,
}: {
  text: string;
  action: string;
  items: ClickDropdownItem[];
}) {
  const [label, setLabel] = useState(text);

  if (items.length === 0) {
    return (
      <Button size="sm" disabled={true}>
        {text}
      </Button>
    );
  }

  if (items.length > 1) {
    return (
      <Dropdown
        name={label}
        data={
          items.map((item) => ({
            icon: item.icon,
            name: item.name,
            onClick: () => {
              item.onClick();
              setLabel(action);
              setTimeout(() => setLabel(text), 1000);
            },
          })) || []
        }
      />
    );
  } else {
    return (
      <Button
        size="sm"
        onClick={() => {
          items[0].onClick();
          setLabel(action);
          setTimeout(() => setLabel(text), 1000);
        }}
      >
        {label}
        {items[0].icon}
      </Button>
    );
  }
}
