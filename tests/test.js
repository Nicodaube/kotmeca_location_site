const {Builder,By,Key,Util} = require('selenium-webdriver');
const script = require('jest');
const { beforeAll } = require('@jest/globals');
 
  
// declaring one test group, with common initialisation.
describe('Execute tests on site kot meca', () => {

  let driver;

  beforeAll(async () => {    
    driver = new Builder().forBrowser("chrome").build();
  }, 10000);
 
  afterAll(async () => {
    await driver.quit();
  }, 20000);
  
  test('Check wrong Password', async () => {
    await driver.get  ( "https://localhost:8080/register" );
    await driver.findElement ( By.name ("Username")). sendKeys ( "Admin");
    await driver.findElement ( By.name ("Password")). sendKeys ( "2334", Key.RETURN );
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('register')
  });

  test('Check wrong Username', async () => {
    await driver.get  ( "https://localhost:8080/register" );
    await driver.findElement ( By.name ("Username")). sendKeys ( "test");
    await driver.findElement ( By.name ("Password")). sendKeys ( "Admin", Key.RETURN );
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('register')
  });

  test('Check login', async () => {
    await driver.get  ( "https://localhost:8080/home" );
    await driver.findElement ( By.name ("Username")). sendKeys ( "Admin");
    await driver.findElement ( By.name ("Password")). sendKeys ( "Admin", Key.RETURN );
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('home')
  });

  test('Check nouvelle location', async () => {
    await driver.get  ( "https://localhost:8080/rental_new" );
    await driver.findElement ( By.name ("caution")). sendKeys ( "test");
    await driver.findElement ( By.name ("commentaire")). sendKeys ( "test", Key.RETURN );
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('rental_new')
  });

  test('Check rental_return', async () => {
    await driver.get  ( "https://localhost:8080/rental_new" );
    await driver.findElement(By.xpath("//span[contains(text(), 'Retour')]")).click()
    await driver.findElement ( By.name ("Prix")). sendKeys ( 5, Key.RETURN );
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('home')
  }); 
  
  test('Check client_new', async () => {
    await driver.get  ( "https://localhost:8080/client_new" );
    await driver.findElement ( By.name ("Prenom")). sendKeys ("test");
    await driver.findElement ( By.name ("Nom")). sendKeys ( "test");
    await driver.findElement ( By.name ("GSM")). sendKeys ("test");
    await driver.findElement ( By.name ("Mail")). sendKeys ("test");
    await driver.findElement ( By.name ("Group")). sendKeys ("test", Key.RETURN);
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('rental_new')
  }); 
  
  test('Check delete_client', async () => {
    await driver.get  ( "https://localhost:8080/client_new" );
    await driver.findElement ( By.name ("TEST")). sendKeys (Key.RETURN);
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('client_new')
  }); 
  
  test('Check inventory_modify', async () => {
    await driver.get  ( "https://localhost:8080/inventory_modify" );
    await driver.findElement ( By.name ("Nom")). sendKeys ("test");
    await driver.findElement ( By.name ("Quantité")). sendKeys ( "test");
    await driver.findElement ( By.name ("Prix")). sendKeys ("test", Key.RETURN);
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('inventory_modify')
  }); 
  
  test('Check delete_tool', async () => {
    await driver.get  ( "https://localhost:8080/inventory_modify" );
    await driver.findElement ( By.name ("test")). sendKeys (Key.RETURN);
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('inventory_modify')
  }); 


  test('Check tool_members', async () => {
    await driver.get  ( "https://localhost:8080/tool_members" );
    await driver.findElement ( By.name ("name")). sendKeys ("test");
    await driver.findElement ( By.name ("password")). sendKeys ( "test");
    await driver.findElement ( By.name ("GSM")). sendKeys ("test");
    await driver.findElement ( By.name ("Mail")). sendKeys ("test", Key.RETURN);
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('tool_members')
  }); 
  
  test('Check delete_members', async () => {
    await driver.get  ( "https://localhost:8080/tool_members" );
    await driver.findElement ( By.name ("test")). sendKeys (Key.RETURN);
    let title = await driver.getCurrentUrl ();
    expect(title).toContain('tool_members')
  }); 
  
  

});
 