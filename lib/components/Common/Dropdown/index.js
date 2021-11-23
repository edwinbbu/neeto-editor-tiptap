import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { usePopper } from "react-popper";
import { Down } from "@bigbinary/neeto-icons";
import { useHotkeys } from "react-hotkeys-hook";
import OutsideClickHandler from "react-outside-click-handler";

import { hyphenize } from "../../utils/common";

const noop = () => {};

const Dropdown = ({
  icon,
  label,
  isOpen,
  onClose = noop,
  ulProps,
  position,
  children,
  autoWidth,
  className,
  buttonStyle = "primary",
  buttonProps,
  customTarget,
  disabled = false,
  closeOnEsc = true,
  closeOnSelect = true,
  closeOnOutsideClick = true,
  dropdownModifiers = [],
  ...otherProps
}) => {
  const Target = customTarget;
  const isControlled = !(isOpen === undefined || isOpen === null);

  const [visible, setVisibility] = useState(false);
  const [reference, setReference] = useState(null);
  const [popper, setPopper] = useState(null);

  const { styles, attributes } = usePopper(reference, popper, {
    placement: position || "bottom-end",
    modifiers: dropdownModifiers,
  });

  const onPopupClose = () => {
    if (!isControlled) setVisibility(false);
    onClose();
  };

  const handlePopperClick = () => {
    closeOnSelect && onPopupClose();
  };

  const handleButtonClick = () => {
    setVisibility(!visible);
  };

  closeOnEsc && useHotkeys("esc", onPopupClose);

  if (!isControlled) {
    buttonProps = {
      ...buttonProps,
      onClick: () => {
        handleButtonClick();
      },
    };
  }

  useEffect(() => {
    isControlled && setVisibility(isOpen);
  }, [isOpen]);

  return (
    <OutsideClickHandler
      useCapture={true}
      onOutsideClick={() => {
        closeOnOutsideClick && onPopupClose();
      }}
    >
      <div
        className={classnames("neeto-ui-dropdown__wrapper h-full", {
          "neeto-ui-dropdown__wrapper--auto-width": autoWidth,
          [className]: className,
        })}
        {...otherProps}
      >
        {customTarget ? (
          <div
            ref={setReference}
            onClick={handleButtonClick}
            className="h-full"
          >
            <Target />
          </div>
        ) : (
          <div>
            {label}
            <Down />
          </div>
        )}
        {visible && (
          <ul
            className="neeto-ui-dropdown__popup"
            ref={setPopper}
            onClick={handlePopperClick}
            data-cy={`${hyphenize(label)}-dropdown-container`}
            {...ulProps}
            style={{
              display: "block",
              ...styles.offset,
              ...styles.popper,
            }}
            {...attributes.popper}
          >
            {children}
          </ul>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;