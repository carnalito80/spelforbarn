import Container from "./container";
import ThemeSwitch from "./themeSwitch";
import { myLoader } from "/utils/all";


export default function Footer(props) {
  return (
    <div id="footWrapper" className="gradientz-bot">
      {/* <Container className="mt-10 border-t border-gray-100 dark:border-gray-800"></Container> */}
      <Container className="mt-10">
        <div className="text-center text-sm">
          Copyright © {new Date().getFullYear()} {props?.copyright} Spel för barn

          
        </div>
        <div className="mt-1 flex justify-center gap-1 text-center text-sm text-gray-500 dark:text-gray-600">
        {/* <ThemeSwitch /> */}
          
          
        <div className="mt-2 flex items-center justify-between">
        
          {/* <ThemeSwitch /> */}
        </div>
        {/* <Backlink /> */}
        </div>
      </Container>
    </div>
  );
}

