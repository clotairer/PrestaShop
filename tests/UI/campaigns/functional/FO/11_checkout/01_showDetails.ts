// Import utils
import helper from '@utils/helpers';
import testContext from '@utils/testContext';

// Import FO pages
import cartPage from '@pages/FO/cart';
import homePage from '@pages/FO/home';
import loginPage from '@pages/FO/login';
import productPage from '@pages/FO/product';

// Import data
import Customers from '@data/demo/customers';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import checkoutPage from "@pages/FO/checkout";
import Products from "@data/demo/products";
import productPage from "@pages/FO/product";
import foProductPage from "@pages/FO/product";

const baseContext: string = 'functional_FO_checkout_showDetails';

/*
Scenario:

 */

describe('FO - Checkout : Show details', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);
    page = await helper.newTab(browserContext);
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  it('should go to FO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

    await homePage.goToFo(page);
    await homePage.changeLanguage(page, 'en');

    const isHomePage = await homePage.isHomePage(page);
    await expect(isHomePage, 'Fail to open FO home page').to.be.true;
  });

  it('should add the first product to cart', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart1', baseContext);

    await homePage.addProductToCartByQuickView(page, 1, 1);

    const isModalClosed = await homePage.closeBlockCartModal(page);
    await expect(isModalClosed).to.be.true;
  });

  it('should add the third product to cart', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart2', baseContext);

    await loginPage.goToHomePage(page);
    await homePage.addProductToCartByQuickView(page, 3, 2);
    await homePage.proceedToCheckout(page);

    const pageTitle = await cartPage.getPageTitle(page);
    await expect(pageTitle).to.equal(cartPage.pageTitle);
  });

  it('should proceed to checkout and go to checkout page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'proceedToCheckout', baseContext);

    await cartPage.clickOnProceedToCheckout(page);

    const isCheckoutPage = await checkoutPage.isCheckoutPage(page);
    await expect(isCheckoutPage).to.be.true;
  });

  it('should check the items number', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'checkItemsNumber', baseContext);

    const itemsNumber = await checkoutPage.getItemsNumber(page);
    await expect(itemsNumber).to.equal('3 items');
  });

  it('should click on \'Show details\' link', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'showDetails', baseContext);

    const isProductsListVisible = await checkoutPage.clickOnShowDetailsLink(page);
    await expect(isProductsListVisible).to.be.true;
  });

  it('should close the cart details', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'closeDetails', baseContext);

    const isProductsListNotVisible = await checkoutPage.closeShowDetailsLink(page);
    await expect(isProductsListNotVisible).to.be.true;
  });

  it('should click on \'Show details\' link', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'showDetails2', baseContext);

    const isProductsListVisible = await checkoutPage.clickOnShowDetailsLink(page);
    await expect(isProductsListVisible).to.be.true;
  });

  it('should check the first product details', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'checkFirstProductDetails', baseContext);
    const result = await checkoutPage.getProductDetails(page, 1);
    await Promise.all([
      await expect(result.image).to.contains(Products.demo_1.coverImage),
      await expect(result.name).to.equal(Products.demo_1.name),
      await expect(result.quantity).to.equal(1),
      await expect(result.price).to.equal(Products.demo_1.finalPrice),
    ]);

    const attributes = await checkoutPage.getProductAttributes(page, 1);
    await expect(attributes).to.equal('Size: S');
  });

  it('should check the second product details', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'checkFirstProductDetails', baseContext);
    const result = await checkoutPage.getProductDetails(page, 2);
    await Promise.all([
      await expect(result.image).to.contains(Products.demo_6.coverImage),
      await expect(result.name).to.equal(Products.demo_6.name),
      await expect(result.quantity).to.equal(2),
      await expect(result.price).to.equal(Products.demo_6.combinations[0].price),
    ]);

    const attributes = await checkoutPage.getProductAttributes(page, 2);
    await expect(attributes).to.equal('Dimension: 40x60cm');
  });

  it('click on first product name', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'clickOnFirstProductName', baseContext);

    page = await checkoutPage.clickOnProductName(page, 1);

    const productInformation = await productPage.getProductInformation(page);
    await expect(productInformation.name).to.equal(Products.demo_1.name);
  });

  it('should close the page and click on the first product image', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'clickOnFirstProductImage', baseContext);

    page = await productPage.closePage(browserContext, page, 0);
    await checkoutPage.clickOnProductImage(page, 1);

    const productInformation = await productPage.getProductInformation(page);
    await expect(productInformation.name).to.equal(Products.demo_1.name);
  });
});
