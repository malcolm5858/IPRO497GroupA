import React from "react";

import { Button, Icon } from "semantic-ui-react";

interface Props {
  change: Function;
  index: number;
}

export function DeleteRapper(props: Props) {
  const { change, index } = props;

  return (
    <Button onClick={(e) => change(index)}>
      <Icon name="delete" />
    </Button>
  );
}
