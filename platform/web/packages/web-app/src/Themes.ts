import { Theme as AruiTheme} from "@smartb/g2-themes";
import { DeepPartial } from "@smartb/g2";
import { PermanentHeader } from "components";

export const theme: DeepPartial<AruiTheme> = {// to complete and to use
  colors: {
    primary: "#EDBA27",
    secondary: "#353945",
  },
  //@ts-ignore
  permanentHeader: PermanentHeader
};
