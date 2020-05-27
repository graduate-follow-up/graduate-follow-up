from time import sleep
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from flask import Flask
from flask import request
import json

app = Flask(__name__)

def connection(username, password):

    # Connection à linkedin
    try:
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        driver = webdriver.Chrome('/usr/lib/chromium/chromedriver', options=chrome_options)
        driver.get('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')
        username_elt = driver.find_element_by_name('session_key')
        username_elt.send_keys(username)
        password_elt = driver.find_element_by_name('session_password')
        password_elt.send_keys(password)
        sign_in_button = driver.find_element_by_class_name('login__form_action_container ')
        sign_in_button.click()
        return driver
    except NoSuchElementException:
        return "Captcha"


def get_profile(name, surname, driver):

    alumni = name + " " + surname
    # Searching alumni profile in search bar
    search_bar = driver.find_element_by_xpath('//*[@class = "search-global-typeahead__input always-show-placeholder"]')
    search_bar.send_keys(alumni)
    search_bar.send_keys(Keys.RETURN)
    sleep(5)
    list_profiles = driver.find_elements_by_class_name("search-result__wrapper")
    profile = None
    i = 0
    # In search results, look for the first
    print(not profile)
    while not profile and (i < len(list_profiles)):
        useless = list_profiles[i].find_element_by_xpath('.//div[@class="search-result__image-wrapper"]')
        usefull = useless.find_element_by_xpath('./following-sibling::div')
        link_tmp = usefull.find_element_by_xpath('./following::a')
        link_tmp = link_tmp.get_attribute('href')
        name_surname = "{0}-{1}".format(name, surname)
        surname_name = "{0}-{1}".format(surname, name)
        if name_surname.lower() in link_tmp or surname_name.lower() in link_tmp:
            profile = link_tmp
        i += 1

    driver.get(profile)
    sleep(5)

    try:
        exp_section = driver.find_element_by_id('experience-section')
        list_exp_elt = exp_section.find_element_by_tag_name('ul')
        found = True
    except NoSuchElementException:
        res = "Aucune experience trouvée."
        found = False


    if found:
        res = []
        # For each experience
        for il in list_exp_elt.find_elements_by_tag_name('li'):
            dict_experience = None
            try:
                poste = il.find_element_by_xpath('.//h3[@class = "t-16 t-black t-bold"]').text
            except NoSuchElementException:
                poste = "Poste inconnu."

            try:
                entreprise = il.find_element_by_xpath('.//p[@class = "pv-entity__secondary-title t-14 t-black t-normal"]').text
            except NoSuchElementException:
                entreprise = "Entreprise inconnue."

            try:
                periode = il.find_element_by_xpath('.//h4[@class = "pv-entity__date-range t-14 t-black--light t-normal"]/span[2]').text
            except NoSuchElementException:
                periode = "Periode inconnue."

            try:
                location = il.find_element_by_xpath('.//h4[@class = "pv-entity__location t-14 t-black--light t-normal block"]/span[2]').text
            except NoSuchElementException:
                location = "Localisation inconnue."

            dict_experience =  {
                    "poste": poste,
                    "entreprise": entreprise,
                    "periode": periode,
                    "localisation": location
                    }
            res.append(dict_experience)

    return res


@app.route("/<alumni>", methods = ["GET"])
def main(alumni):

    driver = connection('linkedin.projetentreprise@gmail.com', 'projetentreprise123*')
    if driver == "Captcha":
        return(json.dumps({'error': 'Captcha'} , sort_keys=True, indent=4, ensure_ascii=False))
    else:
        alumni_name = alumni.split("_")[0]
        alumni_surname = alumni.split("_")[1]
        dict_alumni = {}
        dict_alumni[alumni_name + " " + alumni_surname] = get_profile(alumni_name, alumni_surname, driver)
        driver.quit()
        return(json.dumps(dict_alumni, sort_keys=True, indent=4, ensure_ascii=False))

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=80)
