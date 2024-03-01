import music_xml_parser as mxp
import error as e
import rules14to26 as r1426

fn = "./music-xml-examples/voice-leading-7.musicxml"

if __name__ == '__main__':
    sw = mxp.getScoreWrapper(fn)
    print(sw)

    #for c in sw.chord_wrappers:
        #print(c.location, c.chord_obj.fullName)
        #print(c.melodic_intervals)

    # chords iterated through by next pointer
    curr = sw.chord_wrappers[0]
    while(curr is not None):
        print(curr, curr.inversion)
        errors = r1426.check_rules_14_to_26(curr, sw)
        for error in errors:
            print(error)
        curr = curr.next
    # s.show()