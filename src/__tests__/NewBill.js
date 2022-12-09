/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event';
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the form should display", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const form = screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()
    })
  })

  describe("When I fill all input and click on submit", () => {
    test("The form should have be sent", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
  
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({document, onNavigate, store : null, localStorage : window.localStorage})

      const upDateBill = jest.spyOn(newBill, "updateBill");
      const handleSubmit = jest.fn( newBill.handleSubmit)
      newBill.fileUrl = "C:\fakepath\P8.PNG"
      newBill.fileName = "P8.png"

      const expenseType = screen.getByTestId("expense-type")
      expenseType.value = "Transports"
      const expenseName = screen.getByTestId("expense-name")
      expenseName.value = "expenseTest"
      const date = screen.getByTestId("datepicker")
      date.value = "2022-12-08"
      const amount = screen.getByTestId("amount")
      amount.value = "777"
      const vat = screen.getByTestId("vat")
      vat.value = "20"
      const pct = screen.getByTestId("pct")
      pct.value = "40"

      const bill = {
        email : undefined,
        type: "Transports",
        name:  "expenseTest",
        amount: 777,
        date:  "2022-12-08",
        vat: "20",
        pct: 40,
        commentary: "",
        fileUrl: "C:\fakepath\P8.PNG",
        fileName: "P8.png",
        status: 'pending'
      }

      const form = screen.getByTestId("form-new-bill")
        
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form)
      
      expect(upDateBill).toHaveBeenCalledWith(bill);
      //then updatebill should have been called with bill parameter
    })
  })
  describe("When I select a file", () => {
    test("new bill proof should be posted", () => {
      
      jest.spyOn(mockStore, "bills")

      const html = NewBillUI()
      document.body.innerHTML = html

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
  
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({document, onNavigate, store : mockStore, localStorage : window.localStorage})
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const fileInput = screen.getByTestId("file")

      const file = new File(["foo"], "foo.png", {
        type: "image/png",
      });

      fileInput.addEventListener("change", handleChangeFile)

      userEvent.upload(fileInput, file)

      expect(mockStore.bills).toHaveBeenCalled()
    })
  })
})
