/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
     describe("When I click on icon eye", () => {  // a terminer
      test("Then the bill should display in a modal", () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = BillsUI({ data: bills })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

        const billsContainer = new Bills({
          document, onNavigate, store: null, bills, localStorage: window.localStorage
        })

        const handleClickIconEye = jest.fn( (e) => billsContainer.handleClickIconEye(e))
        $.fn.modal = jest.fn();

        const iconEye = screen.getAllByTestId("icon-eye")[0]
        console.log(billsContainer)
        iconEye.addEventListener("click", (e) => handleClickIconEye(e.target))
        userEvent.click(iconEye)
        expect(handleClickIconEye).toHaveBeenCalled()

        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeTruthy()
      })
    }) 
   /*  test("getBills should return an array", () => {
      jest.spyOn(mockStore, "bills")
      console.log( mockStore.bills().list())

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      const billsContainer = new Bills({
        document, onNavigate, store: mockStore.bills, bills:bills, localStorage: window.localStorage
      })
      console.log(billsContainer.getBills())
      expect(billsContainer.getBills().toEqual(bills))
    }) */

  })
})
