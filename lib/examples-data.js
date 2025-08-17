// Static example data for Vercel deployment
export const examplesData = {
  'breakable-unbreakable': `const doc = (
  <Document>
    <Page size="A4">
      <View break>
        <Text>This text will break</Text>
      </View>
      <View wrap={false}>
        <Text>This text will not wrap</Text>
      </View>
    </Page>
  </Document>
);

export default () => doc;`,

  'quick-start': `// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;`,

  'text': `const styles = StyleSheet.create({
  page: { padding: 30 },
  text: { fontSize: 12 }
});

const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
    </Page>
  </Document>
);

export default MyDocument;`,

  'emoji': `const styles = StyleSheet.create({
  container: {
    height: 700,
    marginVertical: 70,
    marginHorizontal: "10%"
  },
  text: {
    fontSize: 100,
    textAlign: 'center'
  }
});

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

const MyDocument = () => (
  <Document>
    <Page>
      <View style={styles.container}>
        <Text style={styles.text}>
          😀💩👻🙈
        </Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;`,

  'styles': `const styles = StyleSheet.create({
  page: { backgroundColor: 'tomato' },
  section: { color: 'white', textAlign: 'center', margin: 30 }
});

const doc = (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
    </Page>
  </Document>
);

export default () => doc;`,

  'images': `const styles = StyleSheet.create({
  page: { padding: 30 },
  image: { width: 200, height: 200 }
});

const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      <Image 
        style={styles.image} 
        src="https://react-pdf.org/images/logo.png" 
      />
    </Page>
  </Document>
);

export default MyDocument;`,
};

// Get all example names
export const getAllExamples = () => {
  return [
    'breakable-unbreakable',
    'circle',
    'clippath',
    'debugging',
    'disable-hyphenation',
    'disable-wrapping',
    'ellipse',
    'emoji',
    'fixed-components',
    'font-register',
    'fractals',
    'g',
    'hyphenation-callback',
    'images',
    'inline-styles',
    'knobs',
    'line',
    'lineargradient',
    'media-queries',
    'mixed-styles',
    'orphans-and-widows',
    'page-breaks',
    'page-numbers',
    'page-wrap',
    'path',
    'polygon',
    'polyline',
    'quick-start',
    'radialgradient',
    'rect',
    'resume',
    'styles',
    'svg',
    'svgtext',
    'text',
  ];
};