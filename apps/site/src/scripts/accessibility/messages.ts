export type ControlKey='textSize'|'contrast'|'links'|'spacing'|'lineHeight'|'reduceMotion'|'hideImages'|'readableFont'|'largePointer'|'alignment'|'saturation'|'largePanel';
export function accessibilityMessages(locale:string){
 const el=locale==='el';
 return {title:el?'Προτιμήσεις προσβασιμότητας':'Accessibility preferences',close:el?'Κλείσιμο':'Close',reset:el?'Επαναφορά προεπιλογών':'Reset preferences',intro:el?'Πατήστε μια επιλογή για να αλλάξετε την εμφάνιση. Οι προτιμήσεις αποθηκεύονται σε αυτόν τον browser.':'Select a control to adjust your display. Preferences are saved only in this browser.',saved:el?'Οι προτιμήσεις ενημερώθηκαν.':'Preferences updated.',sessionOnly:el?'Οι προτιμήσεις ισχύουν για αυτή τη σελίδα. Η αποθήκευση στον browser δεν είναι διαθέσιμη.':'Preferences apply on this page. Browser storage is unavailable.',resetDone:el?'Έγινε επαναφορά των προεπιλογών.':'Default preferences restored.',systemMotion:el?'Η μειωμένη κίνηση της συσκευής σας εφαρμόζεται πάντα.':'Your device’s reduced-motion preference is always respected.',off:el?'Προεπιλογή':'Default',on:el?'Ενεργό':'On',
 controls:[
  {key:'contrast',icon:'contrast',label:el?'Αντίθεση':'Contrast',states:el?['Προεπιλογή','Υψηλή · σκούρο','Υψηλή · ανοιχτό']:['Default','High · dark','High · light']},
  {key:'links',icon:'links',label:el?'Τονισμός συνδέσμων':'Highlight links'},
  {key:'textSize',icon:'text',label:el?'Μέγεθος βασικού κειμένου':'Base text size',states:['100%','125%','150%','175%','200%']},
  {key:'spacing',icon:'spacing',label:el?'Απόσταση κειμένου':'Text spacing',states:el?['Προεπιλογή','Μεγαλύτερη','Μεγάλη']:['Default','Increased','Wide']},
  {key:'reduceMotion',icon:'motion',label:el?'Μείωση κίνησης':'Reduce motion'},
  {key:'hideImages',icon:'image',label:el?'Απόκρυψη διακοσμητικών εικόνων':'Hide decorative images'},
  {key:'readableFont',icon:'font',label:el?'Απλή γραμματοσειρά':'Simple font'},
  {key:'largePointer',icon:'pointer',label:el?'Μεγαλύτερος δείκτης':'Larger pointer'},
  {key:'lineHeight',icon:'lines',label:el?'Διάστιχο':'Line spacing',states:el?['Προεπιλογή','Άνετο','Αυξημένο']:['Default','Comfortable','Increased']},
  {key:'alignment',icon:'align',label:el?'Στοίχιση κειμένου':'Text alignment',states:el?['Προεπιλογή','Αριστερά','Κέντρο','Δεξιά']:['Default','Left','Centre','Right']},
  {key:'saturation',icon:'saturation',label:el?'Κορεσμός εικόνων':'Image saturation',states:el?['Προεπιλογή','Μειωμένος','Αποχρώσεις γκρι']:['Default','Reduced','Grayscale']},
  {key:'largePanel',icon:'panel',label:el?'Μεγαλύτερο πάνελ':'Larger panel'},
 ] as {key:ControlKey;icon:string;label:string;states?:string[]}[]};
}
