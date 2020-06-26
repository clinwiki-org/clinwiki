import { useMountEffect } from "./useMountEffect";
import { registerHandlebarsHelpers } from "components/MailMerge/MailMergeHelpers";

export default function useHandlebars() {
  useMountEffect(() =>{
    //todo: also register helpers here
    console.log('registerHandlebarsHelpers()');
    registerHandlebarsHelpers();
  });
}