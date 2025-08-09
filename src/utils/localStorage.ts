export const saveFormToLocalStorage = (form: any) => {
    const forms = JSON.parse(localStorage.getItem("forms") || "[]");
    forms.push(form);
    localStorage.setItem("forms", JSON.stringify(forms));
  };
  
  export const getForms = () => {
    return JSON.parse(localStorage.getItem("forms") || "[]");
  };
  