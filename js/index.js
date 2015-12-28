var flowText, immunoText, updateMERatio, updateReportType, updateText;

flowText = function() {
  var flowarray, j, kappa, kappaarray, kratio, lambda, lambdaarray, lratio, markerarray, ratio, s, sentence, x;
  s = [];
  if ($('#flow_lymph').is(":checked")) {
    s.push("Lymphocytes are analyzed using a low forward scatter and low side scatter gating strategy. ");
  }
  if ($('#flow_cd48').is(":checked")) {
    ratio = $('#cd4').val() / $('#cd8').val();
    if (ratio >= 1.6 && ratio < 3) {
      s.push("The ratio of CD4:CD8 is normal at " + ratio.toFixed(2) + ". ");
    }
    if (!(ratio >= 1.6 && ratio < 3)) {
      s.push("The ratio of CD4:CD8 is " + ratio.toFixed(2) + ". ");
    }
  }
  if ($('#flow_btnk').is(":checked")) {
    sentence = "Analysis of the lymphocytes shows that " + $('#bcell').val();
    sentence += "% are B-cells, " + $('#tcell').val();
    sentence += "% are T-cells and " + $('#nkcell').val() + "% are NK cells. ";
    s.push(sentence);
  }
  flowarray = ["#flow_kl1", "#flow_kl2", "#flow_kl3", "#flow_kl4"];
  markerarray = ["CD19-", "CD19+", "CD56-", "CD56+"];
  kappaarray = ["#kappa1", "#kappa2", "#kappa3", "#kappa4"];
  lambdaarray = ["#lambda1", "#lambda2", "#lambda3", "#lambda4"];
  for (x = j = 0; j <= 3; x = ++j) {
    if ($(flowarray[x]).is(":checked")) {
      kappa = $(kappaarray[x]).val();
      lambda = $(lambdaarray[x]).val();
      kratio = kappa / lambda;
      lratio = lambda / kappa;
      if (kratio >= 6.0 || lratio >= 3.0) {
        s.push(markerarray[x] + " plasma cells show a monoclonal pattern with kappa:lambda ratio of " + kratio.toFixed(2) + ". ");
      } else {
        s.push(markerarray[x] + " plasma cells show a polytypic pattern with kappa:lambda ratio of " + kratio.toFixed(2) + ". ");
      }
    }
  }
  if (s.length > 0) {
    return s.join('');
  }
  if (s.length > 0) {
    return "";
  }
};

immunoText = function() {
  var neg, pos, ref, ref1, returntext;
  pos = (ref = $('#pos_markers').val()) != null ? ref : "";
  neg = (ref1 = $('#neg_markers').val()) != null ? ref1 : "";
  if (pos.length > 0 && neg.length > 0) {
    returntext = "positive for " + pos + " and negative for " + neg + "";
  }
  if (pos.length === 0 && neg.length > 0) {
    returntext = "negative for " + neg;
  }
  if (pos.length > 0 && neg.length === 0) {
    returntext = "positive for " + pos;
  }
  if (pos.length === 0 && neg.length === 0) {
    returntext = "_";
  }
  return returntext.replace(/,/g, ", ");
};

updateMERatio = function() {
  var e, l, p, r;
  e = $('#me_erythroid').val();
  p = $('#me_plasma').val();
  l = $('#me_lymph').val();
  r = (100 - p - l - e) / e;
  return $('#me_ratio').val(r.toFixed(2));
};

updateText = function() {
  var areaofinterest, e, entry, i, j, len, ref, reportType, s, updateSection;
  s = [];
  entry = "hello";
  reportType = $('input[type="radio"]:checked:first').val();
  updateSection = function(sectionnames, replaceText, appendreturns) {
    var fn1, fn2;
    if (replaceText == null) {
      replaceText = "";
    }
    if (appendreturns == null) {
      appendreturns = "\n\n";
    }
    fn1 = function(i, e) {
      return s.push(e.value.replace("REPLACE", replaceText));
    };
    fn2 = function(entry) {
      return $('[name="' + entry + '"]:checked').each(fn1);
    };
    sectionnames.forEach(fn2);
    return s.push(appendreturns);
  };
  if (reportType === "BM") {
    updateSection(["wbc", "rbc", "platelet"]);
    if ($("#bmlength2").val() === "0") {
      s.push("The bone marrow biopsy shows a " + $("#bmcell").val() + "cellular bone marrow (cellularity ~" + $("#bmcellpct").val() + ") measuring " + $("#bmlength").val() + " cm. ");
    } else {
      s.push("The bone marrow biopsy shows 2 " + $("#bmcell").val() + "cellular bone marrow fragments (cellularity ~" + $("#bmcellpct").val() + ") measuring " + $("#bmlength").val() + " and " + $("#bmlength2").val() + " cm respectively. ");
    }
    updateSection(["bmoptions"]);
    updateSection(["bmaoptions"]);
    areaofinterest = [];
    ref = $('[name="rbc"]:checked');
    for (e = j = 0, len = ref.length; j < len; e = ++j) {
      i = ref[e];
      areaofinterest.push(e.value);
    }
    updateSection(["touchetc"]);
    updateSection(["immuno"], immunoText());
    updateSection(["flow"], flowText());
    if ($('#me_ratio').val() !== "") {
      s.push("M:E ratio: " + $('#me_ratio').val());
    }
  } else if (reportType === "LN") {
    updateSection(["lymphnode"]);
    updateSection(["immuno"], immunoText());
    updateSection(["flow"], flowText());
  }
  return $("textarea#myoutput").val(s.join(''));
};

updateReportType = function() {
  var bmsections, entry, j, k, len, len1, len2, len3, lnsections, m, n, results, value;
  value = $('input[type="radio"]:checked:first').val();
  bmsections = ["peripheralblood", "bonemarrow", "bonemarrowaspirate", "others", "meratio"];
  lnsections = ["lymphnode"];
  updateText();
  if (value === "BM") {
    for (j = 0, len = bmsections.length; j < len; j++) {
      entry = bmsections[j];
      $('div[name="' + entry + '"]').show();
    }
    for (k = 0, len1 = lnsections.length; k < len1; k++) {
      entry = lnsections[k];
      $('div[name="' + entry + '"]').hide();
    }
  }
  if (value === "LN") {
    for (m = 0, len2 = lnsections.length; m < len2; m++) {
      entry = lnsections[m];
      $('div[name="' + entry + '"]').show();
    }
    results = [];
    for (n = 0, len3 = bmsections.length; n < len3; n++) {
      entry = bmsections[n];
      results.push($('div[name="' + entry + '"]').hide());
    }
    return results;
  }
};

$("#reporttype :input").change(function() {
  return updateReportType();
});

$("#myform :input").change(function() {
  updateMERatio();
  return updateText();
});

updateReportType();
