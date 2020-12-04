<template>
  <div id="app">
    <v-app>
      <v-main>
        <div id="renderer">
          <FormRenderer
            :code="code"
            @contextUpdate="updateContext"
            @jsonSchemaUpdate="updatejsonSchema"
          ></FormRenderer>
        </div>
        <BlocklyComponent
          id="blockly"
          :options="options"
          ref="blockly-ws"
        ></BlocklyComponent>
        <div id="code">
          <div id="control">
            <v-btn
              v-on:click="showCode()"
              class="mx-2"
              fab
              dark
              small
              color="primary"
            >
              <v-icon dark>mdi-play</v-icon>
            </v-btn>
            <v-btn
              v-on:click="reset()"
              class="mx-2"
              fab
              dark
              small
              color="primary"
            >
              <v-icon dark>mdi-stop</v-icon>
            </v-btn>
            <v-btn
              v-on:click="download()"
              class="mx-2"
              dark
              small
              color="primary"
            >
              Save Workspace
            </v-btn>
          </div>

          <v-tabs v-model="tab">
            <v-tab>Context</v-tab>
            <v-tab>JSONSchema</v-tab>
            <v-tab>JS</v-tab>
            <v-tab>XML</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <code-highlight language="json" class="code-preview">
                {{ context }}
              </code-highlight>
              <pre id="context"></pre>
            </v-tab-item>
            <v-tab-item>
              <code-highlight language="json" class="code-preview">
                {{ jsonSchema }}
              </code-highlight>
            </v-tab-item>
            <v-tab-item>
              <code-highlight language="javascript" class="code-preview">
                {{ code }}
              </code-highlight>
            </v-tab-item>
            <v-tab-item>
              <code-highlight language="xml" class="code-preview">
                {{ xml }}
              </code-highlight>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-main></v-app
    >
  </div>
</template>

<script>
import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./prompt";
import BlocklyJS from "blockly/javascript";
import * as Blockly from "blockly/core";
import "./blocks/context";
import "./blocks/fields";
import FormRenderer from "./components/FormRenderer";
import "vue-code-highlight/themes/prism-coy.css";
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import { saveAs } from "file-saver";

export default {
  name: "app",
  components: {
    FormRenderer,
    BlocklyComponent,
    CodeHighlight
  },
  data() {
    return {
      context: {},
      xml: null,
      tab: null,
      jsonSchema: {},
      code: "",
      options: {
        media: "media/",
        grid: {
          spacing: 25,
          length: 3,
          colour: "#ccc",
          snap: true
        },
        toolbox: `<xml>
          <category name="Logic" colour="%{BKY_LOGIC_HUE}">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
            <block type="logic_null"></block>
          </category>
          <category name="Loops" colour="%{BKY_LOOPS_HUE}">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>

            </block>
             <block type="controls_forEach"></block>
            <block type="controls_whileUntil"></block>
          </category>
          <category name="Math" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
              <field name="NUM">123</field>
            </block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
            <block type="math_random_int"></block>
            <block type="math_on_list"></block>
            <block type="math_round"></block>
            <block type="math_number_property"></block>
            <block type="math_constant"></block>
          </category>
          <category name="Text" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
            <block type="text_length"></block>
            <block type="text_join"></block>
            <block type="text_append"></block>
            <block type="text_changeCase"></block>
            <block type="text_indexOf"></block>
            <block type="text_getSubstring"></block>
            <block type="text_isEmpty"></block>
          </category>
          <category name="List" colour="%{BKY_LISTS_HUE}">
            <block type="lists_create_with"></block>
            <block type="lists_length"></block>
            <block type="lists_indexOf"></block>
            <block type="lists_getIndex"></block>
            <block type="lists_setIndex"></block>
            <block type="lists_getSublist"></block>
            <block type="lists_split"></block>
            <block type="lists_sort"></block>
          </category>
          <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}">
            </category>

            <category name="Functions" colour="290" custom="PROCEDURE"></category>
          <category name="FormFields" colour="%{BKY_LOOPS_HUE}">
            <block type="formfield"></block>
            <block type="navigation"></block>
            <block type="formsection"></block>
            <block type="jsonschemaformsection"></block>
            <block type="length_validation"></block>
            <block type="regex_validation"></block>
            <block type="numeric_value_validation"></block>
            <block type="help"></block>
            <block type="enum"></block>
            <block type="enum_from_list"></block>
            <block type="multiple"></block>
          </category>
          <category name="Context" colour="%{BKY_LOOPS_HUE}">
            <block type="fieldfromcontext"></block>
            <block type="getcontext"></block>
          </category>

        </xml>`
      }
    };
  },
  methods: {
    showCode() {
      this.code = BlocklyJS.workspaceToCode(this.$refs["blockly-ws"].workspace);
      this.xml = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(this.$refs["blockly-ws"].workspace)
      );
    },
    reset() {
      this.code = null;
      this.context = null;
    },
    download() {
      if (this.xml != null) {
        var blob = new Blob([this.xml], {
          type: "application/xml;charset=utf-8"
        });
        saveAs(blob, "app.xml");
      }
    },

    updateContext(payload) {
      this.context = payload;
    },

    updatejsonSchema(payload) {
      this.jsonSchema = payload;
    }
  },

  mounted() {
    var xml = Blockly.Xml.textToDom(`
<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="*HwmKbGb(!qDU}kb44B4">rassen</variable><variable id="MG:)|,Z~N#A\`dN].Nc#\`">hundename</variable></variables><block type="procedures_defnoreturn" id=":;8Mu2ZgM.a2-ukH_x8n" collapsed="true" x="238" y="188"><field name="NAME">versicherung</field><comment pinned="false" h="80" w="160">Describe this function...</comment><statement name="STACK"><block type="formsection" id="^tUW_;QjISz+$}7kY59$"><field name="name">versicherung</field><statement name="form_fields"><block type="formfield" id="9%0[cAx\`y0UW%nacmuUP"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">name</field><field name="title">Name der Versicherung</field><next><block type="formfield" id=",Mcx}XI!hJI?QC\`0\`Cm#"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">nummer</field><field name="title">Versicherungsnummer</field></block></next></block></statement><statement name="help"><block type="help" id="fbgb?G~9{Vl*Z8npFY@="><field name="type">title</field><field name="value">Angaben zur Versicherung</field><next><block type="help" id="E8C_sbRz{avGE@vaG~m/"><field name="type">description</field><field name="value">Jeder Hund benötigt eine Hundehalterhaftpflichtversicherung (Mindestversicherungssumme 1 Million EUR ohne bzw. mit höchstens 500 EUR Selbst- beteiligung)</field></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="-PAU2SM^?L/?O@e_x-+$" collapsed="true" x="238" y="212"><field name="NAME">basisdaten_hund</field><comment pinned="false" h="80" w="160">Describe this function...</comment><statement name="STACK"><block type="formsection" id="E1XO{*sr8$+\`boZjQv-I"><field name="name">basisdaten_hund</field><statement name="form_fields"><block type="formfield" id="Y(zb=m-;_v^:%=@]q1na"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">name</field><field name="title">Zucht- oder Rufname</field><next><block type="formfield" id="G8d/vAz~Ie,Q_Zm]3=[O"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">chipnummer</field><field name="title">Chip-Nr.</field><statement name="validation"><block type="regex_validation" id="^aXLDZq99e;QOnlx,8;a"><field name="pattern">^([0-9]{15})$</field><field name="error_message">Nummer besteht nur aus Zahlen</field><next><block type="length_validation" id="#]*)xWlrW(-29awh\`ISt"><field name="type">minLength</field><field name="length">15</field><field name="error_message">Nummer ist exakt 15 Zeichen lang</field><next><block type="length_validation" id="s-QyXwkZ9N)(3:bSN8L:"><field name="type">maxLength</field><field name="length">15</field><field name="error_message">Nummer ist exakt 15 Zeichen lang</field></block></next></block></next></block></statement><next><block type="formfield" id="0x+{C@!\`Wb=|k[4Ndi^)"><field name="type">string</field><field name="widget">date</field><field name="required">TRUE</field><field name="name">wurftag</field><field name="title">Wurftag</field></block></next></block></next></block></statement><statement name="help"><block type="help" id="XZQ@sPubiNELcl0Su[WF"><field name="type">title</field><field name="value">Stamminformationen des Hundes</field></block></statement></block></statement></block><block type="navigation" id="0g54$Nf.y_0!SaJv(q9f" x="512" y="388"><field name="name">grund</field><field name="title">Grund für die Meldung</field><statement name="options"><block type="enum" id="}0$psTwzlV$3RsyusJj2"><field name="value">anmeldung</field><field name="display">Anmeldung</field><next><block type="enum" id="w$w@Ud^$=aU0\`@4o.HFv"><field name="value">umzug</field><field name="display">Wohnungswechsel des Halters</field><next><block type="enum" id="DN6:qkT\`8#;zdQ:l+4Jg"><field name="value">versicherung</field><field name="display">Wechsel der Haftpflichtversicherung</field><next><block type="enum" id="U{Do!FoMih#gDm|*)65z"><field name="value">tod</field><field name="display">Tod oder Abgabe des Hundes</field></block></next></block></next></block></next></block></statement><next><block type="formsection" id=":$mY9PWA.Iy6s!p(n-Te" collapsed="true"><field name="name">person</field><statement name="form_fields"><block type="formfield" id="7v\`zQu$p\`=-Kc0Gy.#:,"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">familienname</field><field name="title">Familienname</field><next><block type="formfield" id="iHIkmYFhiuCzGuWciTXI"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">vorname</field><field name="title">Vorname</field><next><block type="formfield" id="Yzt=862a{net!gn)xxj2"><field name="type">string</field><field name="widget">date</field><field name="required">TRUE</field><field name="name">geburtsdatum</field><field name="title">Geburtsdatum</field><next><block type="formfield" id="[x_#=x9=(ZUL5z/{crF^"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">geburtsname</field><field name="title">Geburtsname</field><statement name="help"><block type="help" id="]mE?6xjq\`$0.ZM206-8@"><field name="type">description</field><field name="value">Falls abweichend vom Familiennnamen</field></block></statement></block></next></block></next></block></next></block></statement><statement name="help"><block type="help" id="e*{,8}x$_g+w9x$i]}z\`"><field name="type">title</field><field name="value">Angaben zur Person</field></block></statement><next><block type="variables_set" id="]]86[-jqoC_3tnUig*H)"><field name="VAR" id="*HwmKbGb(!qDU}kb44B4">rassen</field><value name="VALUE"><block type="lists_split" id="T[,5;B\`?OgEmra1]\`eD!"><mutation mode="SPLIT"></mutation><field name="MODE">SPLIT</field><value name="INPUT"><block type="text" id="rIUI52Wu._Fx}9a}=HZK"><field name="TEXT">English Pointer,English Setter,Kerry Blue Terrier,Cairn Terrier,English Cocker Spaniel,Gordon Setter,Airedale Terrier,Australian Terrier,Bedlington Terrier,Border Terrier,Bullterrier,Foxterrier Glatthaar,English Toy Terrier,Västgötaspets,Belgischer Schäferhund,Bobtail,Griffon Nivernais,Basset d’Artois,Briquet Griffon Vendéen,Ariégeois,Petit Gascon Saintongeois,Grand Gascon Saintongeois,Grand Bleu de Gascogne,Levesque,Poitevin,Billy,Chambray,Normand-Poitevin,Chien d’Artois,Artésien Normand,Porcelaine,Petit Bleu de Gascogne,Griffon bleu de Gascogne,Grand Basset Griffon Vendéen,Basset artésien normand,Basset bleu de Gascogne,Basset fauve de Bretagne,Cão de Água Português,Welsh Corgi Cardigan,Welsh Corgi Pembroke,Irish Soft Coated Wheaten Terrier,Šarplaninac,Jämthund,Basenji,Beauceron,Berner Sennenhund,Appenzeller Sennenhund,Entlebucher Sennenhund,Karelischer Bärenhund,Finnischer Spitz,Neufundländer,Finnischer Laufhund,Polnische Bracke,Komondor,Kuvasz,Puli,Pumi,Kurzhaariger Ungarischer Vorstehhund,Grosser Schweizer Sennenhund,Schweizer Laufhund,Schweizerischer Niederlaufhund,Bernhardiner,Steirische Rauhhaarbracke,Brandlbracke,Österreichischer Pinscher,Malteser,Griffon Fauve de Bretagne,Petit Basset Griffon Vendéen,Tiroler Bracke,Chien de Trait Belge,Lakeland Terrier,Manchester Terrier,Norwich Terrier,Scottish Terrier,Sealyham Terrier,Skye Terrier,Staffordshire Bullterrier,Kontinentaler Zwergspaniel,Welsh Terrier,Braque Belge,Griffon Bruxellois,Griffon Belge,Petit Brabançon,Schipperke,Bloodhound,West Highland White Terrier,Yorkshire Terrier,Gos d’Atura Català,Shetland Sheepdog,Podenco Ibicenco,Perdiguero de Burgos,Mastín Español,Mastín del Pirineo,Cão da Serra de Aires,Podengo Português,Epagneul Breton,Rafeiro do Alentejo,Deutsche Spitze,Deutsch Drahthaar,Weimaraner,Westfälische Dachsbracke,Französische Bulldogge,Kleiner Münsterländer,Deutscher Jagdterrier,Deutscher Wachtelhund,Barbet,Epagneul bleu de Picardie,Griffon à Poil Dur,Epagneul Picard,Clumber Spaniel,Curly Coated Retriever,Golden Retriever,Gråhund,Briard,Epagneul de Pont-Audemer,Braque Saint-Germain,Dogue de Bordeaux,Deutsch Langhaar,Großer Münsterländer,Deutsch Kurzhaar,Irish Red Setter,Flat Coated Retriever,Labrador Retriever,Field Spaniel,Irish Water Spaniel,English Springer Spaniel,Welsh Springer Spaniel,Sussex Spaniel,King-Charles-Spaniel,Smålandsstövare,Drever,Schillerstövare,Hamiltonstövare,Französischer Vorstehhund, Typus Gascogne,Französischer Vorstehhund, Typus Pyrenäen,Schwedischer Lapphund,Cavalier King Charles Spaniel,Chien de Montagne des Pyrénées,Berger des Pyrénées à face rase,Irish Terrier,Boston Terrier,Berger des Pyrénées à poil long,Slovenský čuvač,Dobermann,Deutscher Boxer,Leonberger,Rhodesian Ridgeback,Rottweiler,Dackel,Englische Bulldogge,Serbischer Laufhund,Kurzhaarige Istrianer Bracke,Rauhhaarige Istrianer Bracke,Dalmatiner,Posavski Gonič,Bosanski Oštrodlaki Gonič - Barak,Langhaarcollie,Bullmastiff,Greyhound,English Foxhound,Irischer Wolfshund,Beagle,Whippet,Basset Hound,Deerhound,Spinone Italiano,Deutscher Schäferhund,Amerikanischer Cocker Spaniel,Dandie Dinmont Terrier,Foxterrier Drahthaar,Cão de Castro Laboreiro,Bouvier des Ardennes,Pudel,Cão da Serra da Estrela,Griffon à Poil Laineux,Epagneul Français,Berger de Picardie,Braque de l’Ariège,Braque Dupuy,Braque du Bourbonnais,Braque d’Auvergne,Riesenschnauzer,Mittelschnauzer,Zwergschnauzer,Deutscher Pinscher,Zwergpinscher,Affenpinscher,Perdigueiro Português,Sloughi,Finnischer Lapphund,Hovawart,Bouvier des Flandres,Kromfohrländer,Barsoi,Bergamasker Hirtenhund,Volpino Italiano,Bologneser,Mastino Napoletano,Segugio Italiano (Drahthaar),Cirneco dell’Etna,Italienisches Windspiel,Maremmen-Abruzzen-Schäferhund,Bracco Italiano,Dunker,Sabueso Español,Chow-Chow,Japan Chin,Pekingese,Shih Tzu,Tibet-Terrier,Harlekinpinscher,Kanadischer Eskimohund,Samojede,Hannoverscher Schweißhund,Hellinikos Ichnilatis,Bichon Frisé,Pudelpointer,Bayerischer Gebirgsschweißhund,Chihuahua,Französischer Laufhund Dreifarbig,Französischer Laufhund Weiss-Schwarz,Wetterhoun,Stabyhoun,Hollandse Herdershond,Drentscher Hühnerhund,Fila Brasileiro,Landseer,Lhasa Apso,Afghanischer Windhund,Dreifarbiger Serbischer Laufhund,Tibetdogge,Tibet-Spaniel,Deutsch Stichelhaar,Löwchen,Xoloitzcuintle,Deutsche Dogge,Australian Silky Terrier,Norwegischer Buhund,Mudi,Drahthaariger Ungarischer Vorstehhund,Magyar Agár,Erdélyi Kopó,Norwegischer Elchhund grau,Alaskan Malamute,Slovenský kopov,Český fousek,Tschechischer Terrier,Aidi,Pharaonenhund,Ca de Bou,Havaneser,Polski Owczarek Nizinny,Polski Owczarek Podhalanski,Mops,Alpenländische Dachsbracke,Akita,Japanese Middle-size Dog,Shiba,Sanshu,Japanischer Terrier,Tosa Inu,Hokkaidō,Japan-Spitz,Chesapeake Bay Retriever,Mastiff,Norwegischer Lundehund,Hygenhund,Haldenstøver,Norwegischer Elchhund schwarz,Saluki,Siberian Husky,Bearded Collie,Norfolk Terrier,Kanaanhund,Grönlandhund,Rastreador Brasileiro,Norrbottenspitz,Hrvatski ovčar,Karst-Schäferhund,Montenegrinischer Gebirgslaufhund,Steinbracke,Altdänischer Vorstehhund,Grand Griffon Vendéen,Coton de Tuléar,Lappländischer Rentierhund,Galgo Español,American Staffordshire Terrier,Australian Cattle Dog,Chinesischer Schopfhund,Islandhund,Beagle-Harrier,Eurasier,Dogo Argentino,Australian Kelpie,Otterhund,Harrier,Kurzhaarcollie,Border Collie,Lagotto Romagnolo,Deutsche Bracke,Black and Tan Coonhound,American Water Spaniel,Glen of Imaal Terrier,American Foxhound,Laika, Russisch-Europäisch,Laika, Ostsibirisch,Laika, Westsibirisch,Azawakh,Hollandse Smoushond,Shar-Pei,Peruanischer Nackthund,Saarlooswolfhund,Nova Scotia Duck Tolling Retriever,Schapendoes,Kooikerhondje,Broholmer,Französischer Laufhund Weiss-Orange,Kai,Kishu,Shikoku,Slovenský hrubosrstý stavač,Ca de Bestiar,Grand Anglo-Français tricolore,Grand Anglo-Français blanc et noir,Grand Anglo-Français blanc et orange,Anglo-Français de petite vénerie,Südrussischer Owtscharka,Russischer Schwarzer Terrier,Kaukasischer Owtscharka,Podenco Canario,Irish Red and White Setter,Anatolischer Hirtenhund (bis 2018),Kangal-Hirtenhund (seit 25. Juni 2018),Tschechoslowakischer Wolfhund,Chart Polski,Korea Jindo Dog,Zentralasiatischer Owtscharka,Perro de Agua Español,Segugio Italiano (Kurzhaar),Thai Ridgeback,Parson Russell Terrier,Cão Fila de São Miguel,Terrier Brasileiro,Australian Shepherd,Cane Corso Italiano,American Akita,Jack Russell Terrier,Dogo Canario,Berger Blanc Suisse,Taiwanhund,Ciobănesc Românesc Mioritic,Ciobănesc Românesc Carpatin,Australian Stumpy Tail Cattle Dog,Russkiy Toy,Cimarrón Uruguayo,Gończy Polski,Tornjak,Dansk-Svensk Gårdshund,Ciobănesc Românesc de Bucovina,Thai Bangkaew Dog,Miniature Bull Terrier,Lancashire Heeler,Segugio Maremmano,Kintamani-Bali-Hund,Prager Rattler,Böhmischer Schäferhund,Yakutskaya Laika,Estnische Bracke,Miniatur Amerikanischer Schäferhund,Transmontano-Hirtenhund</field></block></value><value name="DELIM"><block type="text" id="*WeVi~h)kq5Z./W9Tqxu"><field name="TEXT">,</field></block></value></block></value><next><block type="controls_if" id="J6H6hVn8n:3Tp7Aimd_8"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Z-/|:N2sfrkP)=[~25n/"><field name="OP">EQ</field><value name="A"><block type="fieldfromcontext" id="ef8jnaLz-gl1r,qNnZ=m"><field name="element">grund</field><value name="Context"><block type="getcontext" id="d:b/bi^cwrcrzn*OjhsM"></block></value></block></value><value name="B"><block type="text" id="pWFiAv!F5HHf|HXtw_[1"><field name="TEXT">anmeldung</field></block></value></block></value><statement name="DO0"><block type="formsection" id="f,TTVq/A*m162^o}G6u/" collapsed="true"><field name="name">anmeldedaten</field><statement name="form_fields"><block type="formfield" id="U_,@U0.3qMN]qs6rYN#_"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">name</field><field name="title">Zucht- oder Rufname</field><next><block type="formfield" id="5~@#d^7?iyWRh\`0JqW7*"><field name="type">array</field><field name="widget"></field><field name="required">TRUE</field><field name="name">rasse</field><field name="title">Rasse, ggf. Kreuzung mit</field><statement name="help"><block type="help" id="P|3D9+h.L5EUD6%9j+n@"><field name="type">description</field><field name="value">Bei Kreuzung bitte alle bekannten Rassen angeben.</field></block></statement><statement name="enums"><block type="enum_from_list" id="O@_=MF~D!20Of9(+ixt8"><value name="list"><block type="variables_get" id="h|{vue6cnhT|/L=R6ax}"><field name="VAR" id="*HwmKbGb(!qDU}kb44B4">rassen</field></block></value></block></statement><next><block type="formfield" id="{TZMU/tqfokb5tH8LU5P"><field name="type">number</field><field name="widget"></field><field name="required">TRUE</field><field name="name">groesse</field><field name="title">Schulterhöhe in CM</field><statement name="validation"><block type="numeric_value_validation" id=";65u^f4X6y|@)pj?CDab"><field name="type">minimum</field><field name="value">15</field><field name="error_message">Eine Ratte?</field><next><block type="numeric_value_validation" id="7G0pZ1s)~GUNbD0z\`RJV"><field name="type">minimum</field><field name="value">250</field><field name="error_message">Zu großer Hund!</field></block></next></block></statement><next><block type="formfield" id="8|yRT+b?:JHhL;Dgji+z"><field name="type">string</field><field name="widget">radio</field><field name="required">TRUE</field><field name="name">geschlecht</field><field name="title">GeSCHLECHT</field><statement name="help"><block type="enum" id="tkOx+XU.T{Ua|c%esa=u"><field name="value">weiblich</field><field name="display">weiblich</field><next><block type="enum" id="Aqv**)H$6)FNk,+S;tv_"><field name="value">maennlich</field><field name="display">männlich</field></block></next></block></statement><next><block type="formfield" id=":@X,$\`sC8\`l}kGJRLzq5"><field name="type">string</field><field name="widget">date</field><field name="required">TRUE</field><field name="name">wurftag</field><field name="title">Wurftag</field><next><block type="formfield" id=";Os[woRM2~sCdrz6a|Gu"><field name="type">string</field><field name="widget">date</field><field name="required">TRUE</field><field name="name">beginnHaltung</field><field name="title">Beginn der Hundehaltung</field><next><block type="formfield" id=")mb84:m@vR[:Y]v8)qXw"><field name="type">string</field><field name="widget"></field><field name="required">TRUE</field><field name="name">chipnummer</field><field name="title">Chip-Nr.</field><statement name="validation"><block type="regex_validation" id="%xpN0~eT$8uoO8@zA*0V"><field name="pattern">^([0-9]{15})$</field><field name="error_message">Nummer besteht nur aus Zahlen</field><next><block type="length_validation" id="X}7}.N%-p_o]#LZp|^T;"><field name="type">minLength</field><field name="length">15</field><field name="error_message">Nummer ist exakt 15 Zeichen lang</field><next><block type="length_validation" id="j)E,U%Dk%0nJ=rfEg;@F"><field name="type">maxLength</field><field name="length">15</field><field name="error_message">Nummer ist exakt 15 Zeichen lang</field></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></statement><statement name="help"><block type="help" id="T5]lL/uowMJO;Z(co,G\`"><field name="type">title</field><field name="value">Allgemeine Angeben zum Hund</field></block></statement><next><block type="variables_set" id=",bw54%95Z.M)POm8~3Be"><field name="VAR" id="MG:)|,Z~N#A\`dN].Nc#\`">hundename</field><value name="VALUE"><block type="fieldfromcontext" id="8PU!:g{]$jqRkb]BP[-i"><field name="element">anmeldedaten.name</field><value name="Context"><block type="getcontext" id="fdB#YoVHBI,znc^@{l2m"></block></value></block></value><next><block type="procedures_callnoreturn" id=";,B/SCb#th7Y)tC%ha%M"><mutation name="versicherung"></mutation></block></next></block></next></block></statement><statement name="ELSE"><block type="procedures_callnoreturn" id="B*m|u;I.W@:Vd)bFbk!b"><mutation name="basisdaten_hund"></mutation><next><block type="variables_set" id="Kd9t)BJ{?z2!(/r#-J~^"><field name="VAR" id="MG:)|,Z~N#A\`dN].Nc#\`">hundename</field><value name="VALUE"><block type="fieldfromcontext" id="XnorZ=d91mu+YUci73|\`"><field name="element">basisdaten_hund.name</field><value name="Context"><block type="getcontext" id="AjgMPGyIB.#g{{8.oDP@"></block></value></block></value><next><block type="controls_if" id="=Hros6c0Lfn:^kF(+iZ["><mutation elseif="1"></mutation><value name="IF0"><block type="logic_compare" id="F[8E.@n#[TrMo}[pR+=G"><field name="OP">EQ</field><value name="A"><block type="fieldfromcontext" id="j0f;?5|R*KD@i;oWe0l_"><field name="element">grund</field><value name="Context"><block type="getcontext" id="KP%N})cZ}Vfnh#?EHcg$"></block></value></block></value><value name="B"><block type="text" id="H#-y#GY?5E0aL:D_Lzym"><field name="TEXT">versicherung</field></block></value></block></value><statement name="DO0"><block type="procedures_callnoreturn" id="pVrcu~%^,(;EPk~Eh2V!"><mutation name="versicherung"></mutation></block></statement><value name="IF1"><block type="logic_compare" id="v5|v\`4-T87w$+c:Nu7~."><field name="OP">EQ</field><value name="A"><block type="fieldfromcontext" id="Pc+wjp]mw{q/|pM=([fY"><field name="element">grund</field><value name="Context"><block type="getcontext" id="(9PLwkBlrt[@lD#/S3Ur"></block></value></block></value><value name="B"><block type="text" id="|mb7%zmvCJ~(%apLukmr"><field name="TEXT">tod</field></block></value></block></value><statement name="DO1"><block type="formsection" id="|APtQf,!BScA9iye;#k^"><field name="name">tod</field><statement name="form_fields"><block type="formfield" id="eR):xe5A?nB\`$F^pwkMl"><field name="type">string</field><field name="widget">date</field><field name="required">TRUE</field><field name="name">datum</field><field name="title">Gestorben oder abgegeben am</field></block></statement><statement name="help"><block type="help" id="yO84RO5(AfsPbhq-9bYV"><field name="type">title</field><field name="value">Abmeldedatum</field></block></statement></block></statement></block></next></block></next></block></statement><next><block type="navigation" id="]OT[0H%*;2xw^}RKQ#}{"><field name="name">danke</field><field name="title">Vielen Dank für diese Meldung!</field><statement name="options"><block type="enum" id="}W2yC4Oxa3yA$JPfE\`+r"><field name="value">1</field><field name="display">🐕</field><next><block type="enum" id="]m8mk$|v0RtI;VHhK:Bh"><field name="value">2</field><field name="display">🐕🐕</field><next><block type="enum" id=":UEtJ?Ch;z{HRC9jT(yr"><field name="value">3</field><field name="display">🐕🐕🐕</field></block></next></block></next></block></statement><statement name="help"><block type="help" id="A^{z+4}|4u7gz[4(?)hO"><field name="type">description</field><field name="value"></field><value name="value"><block type="text_join" id="UkYkn8D_olLbjG{3uX#|"><mutation items="3"></mutation><value name="ADD0"><block type="text" id="z:9s]FF0bhzMTzI=nFwr"><field name="TEXT">Vielen Dank, das sie diese Meldung für Ihren Hund </field></block></value><value name="ADD1"><block type="variables_get" id="jdyw=FLe3=h/+[OX1i}C"><field name="VAR" id="MG:)|,Z~N#A\`dN].Nc#\`">hundename</field></block></value><value name="ADD2"><block type="text" id="/;bfTAxnUEpZ8YLig)F+"><field name="TEXT"> gemacht haben. Bitte bewerten sie uns jetzt!</field></block></value></block></value></block></statement></block></next></block></next></block></next></block></next></block></xml>
      `);
    Blockly.Xml.domToWorkspace(xml, this.$refs["blockly-ws"].workspace);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html,
body {
  margin: 0;
}
#code {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 50%;
  margin: 0;
  overflow: hidden;
}

#blockly {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
}
#renderer {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 50%;
  margin: 0;
  overflow: scroll;
}

#control {
  width: 100%;
  height: 60px;
  text-align: center;
  background: #fff;
  border-top: 1px solid #000;
  padding: 10px;
}

#context {
  width: 100%;
  background-color: #eee;
}
.code-preview {
  overflow: scroll;
  max-height: 300px;
}
</style>
